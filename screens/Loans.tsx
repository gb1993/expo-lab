import {useEffect, useMemo, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator, TextInput} from 'react-native';
import {supabase} from '../lib/supabase';
import {Database} from '../database.types';

type LoanRow = Database['public']['Tables']['loans']['Row'];
type CustomerRow = Database['public']['Tables']['customers']['Row'];

type LoanWithCustomer = LoanRow & {
  customers: Pick<CustomerRow, 'name'> | null;
};

export default function Loans() {
  const [loans, setLoans] = useState<LoanWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    setLoading(true);

    const {data, error} = await supabase
      .from('loans')
      .select(
        `
        *,
        customers (
          name
        )
      `,
      )
      .order('created_at', {ascending: false});

    if (error) {
      console.log(error);
    } else {
      setLoans(data ?? []);
    }

    setLoading(false);
  }

  // 🔹 Cálculo da previsão de término
  function calculateEndDate(loan: LoanRow) {
    const startDate = new Date(loan.data_solicitacao);
    const parcelas = loan.numero_parcelas;

    if (loan.frequencia_pagamento === 'semanal') {
      startDate.setDate(startDate.getDate() + parcelas * 7);
    }

    if (loan.frequencia_pagamento === 'quinzenal') {
      startDate.setDate(startDate.getDate() + parcelas * 15);
    }

    if (loan.frequencia_pagamento === 'mensal') {
      startDate.setMonth(startDate.getMonth() + parcelas);
    }

    return startDate;
  }

  // 🔹 Filtro por nome
  const filteredLoans = useMemo(() => {
    if (!search.trim()) return loans;

    return loans.filter(loan =>
      loan.customers?.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, loans]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, padding: 16}}>
      {/* 🔍 Campo de busca */}
      <TextInput
        placeholder="Buscar por nome do cliente..."
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
        data={filteredLoans}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Nenhum empréstimo encontrado
          </Text>
        }
        renderItem={({item}) => {
          const endDate = calculateEndDate(item);

          return (
            <View
              style={{
                backgroundColor: '#fff',
                padding: 16,
                marginBottom: 12,
                borderRadius: 10,
                elevation: 3,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {item.customers?.name}
              </Text>

              <Text>Valor: R$ {Number(item.valor).toFixed(2)}</Text>
              <Text>Juros: {(Number(item.juros) * 100).toFixed(2)}%</Text>
              <Text>Parcelas: {item.numero_parcelas}</Text>
              <Text>Frequência: {item.frequencia_pagamento}</Text>
              <Text>
                Início: {new Date(item.data_solicitacao).toLocaleDateString()}
              </Text>
              <Text>Previsão término: {endDate.toLocaleDateString()}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
