import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {supabase} from '../lib/supabase';
import {Database} from '../database.types';

type LoanRow = Database['public']['Tables']['loans']['Insert'];

type Props = {
  customerId: string;
  onCreated: () => void;
  onCancel: () => void;
};

export default function CreateLoan({customerId, onCreated, onCancel}: Props) {
  const [valor, setValor] = useState('');
  const [juros, setJuros] = useState(''); // porcentagem: 10 = 10%
  const [numeroParcelas, setNumeroParcelas] = useState('');
  const [frequencia, setFrequencia] = useState<
    'semanal' | 'quinzenal' | 'mensal'
  >('mensal');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!valor || !juros || !numeroParcelas) {
      Alert.alert('Preencha todos os campos obrigatórios');
      return;
    }

    const loanData: LoanRow = {
      customer_id: customerId,
      valor: parseFloat(valor),
      juros: parseFloat(juros) / 100, // converte porcentagem para decimal
      numero_parcelas: parseInt(numeroParcelas),
      frequencia_pagamento: frequencia,
      status: 'ativo',
    };

    setLoading(true);
    const {error} = await supabase.from('loans').insert(loanData);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao criar empréstimo', error.message);
    } else {
      Alert.alert('Empréstimo criado com sucesso!');
      onCreated();
    }
  }

  return (
    <ScrollView style={{flex: 1, padding: 16}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>
        Criar novo empréstimo
      </Text>

      <Text>Valor (R$):</Text>
      <TextInput
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <Text>Juros (%):</Text>
      <TextInput
        keyboardType="numeric"
        value={juros}
        onChangeText={setJuros}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <Text>Número de parcelas:</Text>
      <TextInput
        keyboardType="numeric"
        value={numeroParcelas}
        onChangeText={setNumeroParcelas}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <Text>Frequência:</Text>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        {(['semanal', 'quinzenal', 'mensal'] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFrequencia(f)}
            style={{
              padding: 10,
              marginRight: 8,
              borderRadius: 8,
              backgroundColor: frequencia === f ? '#007bff' : '#f1f1f1',
            }}>
            <Text style={{color: frequencia === f ? '#fff' : '#000'}}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleCreate}
        style={{
          padding: 14,
          backgroundColor: '#28a745',
          borderRadius: 8,
          marginBottom: 12,
        }}>
        <Text style={{color: '#fff', textAlign: 'center'}}>
          {loading ? 'Criando...' : 'Criar Empréstimo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCancel}
        style={{
          padding: 14,
          backgroundColor: '#6c757d',
          borderRadius: 8,
        }}>
        <Text style={{color: '#fff', textAlign: 'center'}}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
