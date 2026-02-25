import {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {supabase} from '../lib/supabase';
import {Database} from '../database.types';
import {theme} from '../themes';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import {useAppNavigation} from '../hooks/useAppNavigation';

type MainStackParamList = {
  CreateLoan: {customerId?: string};
};

type LoanRow = Database['public']['Tables']['loans']['Insert'];

export default function CreateLoan() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'CreateLoan'>>();
  const {customerId} = route.params || {};

  const [valor, setValor] = useState('');
  const [juros, setJuros] = useState('');
  const [cobranca, setCobranca] = useState<'semanal' | 'quinzenal' | 'mensal'>(
    'mensal',
  );
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState<string>('');

  useEffect(() => {
    async function getCustomer() {
      if (customerId) {
        const {data} = await supabase
          .from('customers')
          .select('name')
          .eq('id', customerId)
          .single();
        if (data) setCustomerName(data.name ?? '');
      }
    }
    getCustomer();
  }, [customerId]);

  async function handleCreate() {
    if (!valor || !juros || !customerId) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    const loanData: LoanRow = {
      customer_id: customerId,
      valor: parseFloat(valor.replace(',', '.')),
      juros: parseFloat(juros.replace(',', '.')) / 100,
      cobranca: cobranca, // Enviando para a coluna correta
    };

    setLoading(true);
    const {error} = await supabase.from('loans').insert(loanData);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao criar empréstimo', error.message);
    } else {
      Alert.alert('Sucesso', 'Empréstimo registrado com sucesso!', [
        {
          text: 'Ir para Empréstimos',
          onPress: () => navigation.navigate('loans'),
        },
      ]);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header com Card */}
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <FontAwesome6
            name="file-invoice-dollar"
            size={24}
            color={theme.colors.green}
          />
        </View>
        <View style={{flex: 1}}>
          <CustomText text="Novo Empréstimo" fontSize="lg" weight="bold" />
          <CustomText
            text={
              customerName ? `Para: ${customerName}` : 'Carregando cliente...'
            }
            color={theme.colors.purpleSecondary}
          />
        </View>
      </View>

      <View style={styles.formCard}>
        {/* Campo Valor */}
        <View style={styles.inputGroup}>
          <CustomText
            text="Valor solicitado (R$)"
            weight="bold"
            fontSize="sm"
            color={theme.colors.purpleSecondary}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="0,00"
            value={valor}
            onChangeText={setValor}
            style={styles.input}
            placeholderTextColor="#CCC"
          />
        </View>

        {/* Campo Juros */}
        <View style={styles.inputGroup}>
          <CustomText
            text="Taxa de juros mensal (%)"
            weight="bold"
            fontSize="sm"
            color={theme.colors.purpleSecondary}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="Ex: 10"
            value={juros}
            onChangeText={setJuros}
            style={styles.input}
            placeholderTextColor="#CCC"
          />
        </View>

        {/* Frequência / Cobrança */}
        <View style={styles.inputGroup}>
          <CustomText
            text="Frequência de cobrança"
            weight="bold"
            fontSize="sm"
            color={theme.colors.purpleSecondary}
            style={{marginBottom: 12}}
          />
          <View style={styles.tabsRow}>
            {(['semanal', 'quinzenal', 'mensal'] as const).map(f => (
              <Pressable
                key={f}
                onPress={() => setCobranca(f)}
                style={[
                  styles.tabItem,
                  cobranca === f && {
                    backgroundColor: theme.colors.purpleSecondary,
                    borderColor: theme.colors.purpleSecondary,
                  },
                ]}>
                <CustomText
                  text={f.charAt(0).toUpperCase() + f.slice(1)}
                  color={cobranca === f ? '#fff' : theme.colors.purpleSecondary}
                  weight={cobranca === f ? 'bold' : 'regular'}
                  fontSize="sm"
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton
          onPress={handleCreate}
          text={loading ? 'Registrando...' : 'Confirmar Empréstimo'}
          disabled={loading}
        />
        <CustomButton
          onPress={() => navigation.goBack()}
          text={'Desistir e Voltar'}
          textColor={theme.colors.danger}
          backgroundColor="transparent"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    gap: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputGroup: {
    gap: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  footer: {
    marginTop: 30,
    gap: 10,
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 12,
  },
});
