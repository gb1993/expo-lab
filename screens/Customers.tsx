import {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {supabase} from '../lib/supabase';
import {Database} from '../database.types';
import CreateLoan from './CreateLoan';

type CustomerRow = Database['public']['Tables']['customers']['Row'];
type LoanRow = Database['public']['Tables']['loans']['Row'];

type CustomerWithLoans = CustomerRow & {
  loans: LoanRow[];
};

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerWithLoans[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithLoans | null>(null);
  const [creatingLoan, setCreatingLoan] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const {data, error} = await supabase
      .from('customers')
      .select(`*, loans (*)`)
      .order('created_at', {ascending: false});
    if (error) console.log(error);
    else setCustomers(data ?? []);
    setLoading(false);
  }

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    return customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, customers]);

  function calculateTotalWithInterest(loan: LoanRow) {
    return Number(loan.valor) * (1 + Number(loan.juros));
  }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, padding: 16}}>
      <TextInput
        placeholder="Buscar cliente..."
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: '#f1f1f1',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const totalEmprestado = item.loans.reduce(
            (acc, loan) => acc + Number(loan.valor),
            0,
          );
          return (
            <TouchableOpacity
              onPress={() => setSelectedCustomer(item)}
              style={{
                backgroundColor: '#fff',
                padding: 16,
                marginBottom: 12,
                borderRadius: 10,
                elevation: 2,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {item.name}
              </Text>
              <Text>{item.email}</Text>
              <Text>Empréstimos: {item.loans.length}</Text>
              <Text>Total solicitado: R$ {totalEmprestado.toFixed(2)}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={!!selectedCustomer} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: '85%',
            }}>
            {selectedCustomer && (
              <ScrollView>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  {selectedCustomer.name}
                </Text>
                <Text>Email: {selectedCustomer.email}</Text>
                <Text>Celular: {selectedCustomer.celular}</Text>
                <Text>CPF: {selectedCustomer.cpf}</Text>
                <Text>Endereço: {selectedCustomer.address}</Text>

                <Text style={{marginTop: 20, fontWeight: 'bold'}}>Resumo</Text>
                <Text>
                  Total emprestado: R$
                  {selectedCustomer.loans
                    .reduce((acc, l) => acc + Number(l.valor), 0)
                    .toFixed(2)}
                </Text>
                <Text>
                  Total com juros: R$
                  {selectedCustomer.loans
                    .reduce((acc, l) => acc + calculateTotalWithInterest(l), 0)
                    .toFixed(2)}
                </Text>

                <Text style={{marginTop: 20, fontSize: 16, fontWeight: 'bold'}}>
                  Empréstimos
                </Text>
                {selectedCustomer.loans.length === 0 && (
                  <Text>Nenhum empréstimo</Text>
                )}

                {selectedCustomer.loans.map(loan => (
                  <View
                    key={loan.id}
                    style={{
                      marginTop: 10,
                      padding: 12,
                      backgroundColor: '#f7f7f7',
                      borderRadius: 8,
                      borderLeftWidth: 5,
                      borderLeftColor:
                        loan.status === 'ativo' ? 'orange' : 'green',
                    }}>
                    <Text>Valor: R$ {Number(loan.valor).toFixed(2)}</Text>
                    <Text>
                      Total com juros: R${' '}
                      {calculateTotalWithInterest(loan).toFixed(2)}
                    </Text>
                    <Text>Parcelas: {loan.numero_parcelas}</Text>
                    <Text>Status: {loan.status}</Text>
                    <Text>Frequência: {loan.frequencia_pagamento}</Text>
                    <Text>Juros: {(loan.juros * 100).toFixed(2)}%</Text>
                  </View>
                ))}

                {!creatingLoan && (
                  <TouchableOpacity
                    onPress={() => setCreatingLoan(true)}
                    style={{
                      marginTop: 20,
                      padding: 14,
                      backgroundColor: '#007bff',
                      borderRadius: 8,
                    }}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                      Criar novo empréstimo
                    </Text>
                  </TouchableOpacity>
                )}

                {creatingLoan && selectedCustomer && (
                  <CreateLoan
                    customerId={selectedCustomer.id}
                    onCreated={() => {
                      setCreatingLoan(false);
                      fetchCustomers();
                    }}
                    onCancel={() => setCreatingLoan(false)}
                  />
                )}

                <TouchableOpacity
                  onPress={() => {
                    setSelectedCustomer(null);
                    setCreatingLoan(false);
                  }}
                  style={{
                    marginTop: 12,
                    padding: 14,
                    backgroundColor: '#000',
                    borderRadius: 8,
                  }}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Fechar
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
