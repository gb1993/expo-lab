import {useEffect, useMemo, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {format, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import {supabase} from '../lib/supabase';
import {Database} from '../database.types';
import {theme} from '../themes';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';

type LoanRow = Database['public']['Tables']['loans']['Row'];
type CustomerRow = Database['public']['Tables']['customers']['Row'];
type LoanInsert = Database['public']['Tables']['loans']['Insert'];

type LoanWithCustomer = LoanRow & {
  customers: Pick<CustomerRow, 'name'> | null;
};

const STATUS_FILTERS = ['Todos', 'Ativo', 'Atrasado', 'Finalizado'];
const COBRANCA_OPTIONS = ['semanal', 'quinzenal', 'mensal'] as const;

export default function Loans() {
  const [loans, setLoans] = useState<LoanWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');
  const [selectedLoan, setSelectedLoan] = useState<LoanWithCustomer | null>(null);

  // Estados para o Novo Empréstimo
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [foundCustomers, setFoundCustomers] = useState<CustomerRow[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
  const [loanForm, setLoanForm] = useState({
    valor: '',
    juros: '',
    cobranca: 'mensal' as 'semanal' | 'quinzenal' | 'mensal'
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (customerSearch.length > 2) {
      searchCustomers();
    } else {
      setFoundCustomers([]);
    }
  }, [customerSearch]);

  async function fetchLoans() {
    setLoading(true);
    const {data, error} = await supabase
      .from('loans')
      .select(`*, customers (name)`)
      .order('created_at', {ascending: false});

    if (!error) setLoans(data ?? []);
    setLoading(false);
  }

  async function searchCustomers() {
    const {data} = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${customerSearch}%,celular.ilike.%${customerSearch}%`)
      .limit(5);
    setFoundCustomers(data ?? []);
  }

  async function handleCreateLoan() {
    if (!selectedCustomer || !loanForm.valor || !loanForm.juros) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const newLoan: LoanInsert = {
      customer_id: selectedCustomer.id,
      valor: parseFloat(loanForm.valor.replace(',', '.')),
      juros: parseFloat(loanForm.juros.replace(',', '.')) / 100,
      cobranca: loanForm.cobranca,
      status: 'ativo'
    };

    const {error} = await supabase.from('loans').insert([newLoan]);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Empréstimo criado!');
      resetAddModal();
      fetchLoans();
    }
  }

  function resetAddModal() {
    setIsAddModalVisible(false);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setLoanForm({ valor: '', juros: '', cobranca: 'mensal' });
  }

  const formatFriendlyDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', {locale: ptBR});
    } catch (e) {
      return 'Data inválida';
    }
  };

  function getStatusColor(status: string | null) {
    switch (status?.toLowerCase()) {
      case 'ativo': return theme.colors.alert;
      case 'finalizado': return theme.colors.success;
      case 'atrasado': return theme.colors.danger;
      default: return theme.colors.purpleSecondary;
    }
  }

  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const matchesSearch = loan.customers?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === 'Todos' || loan.status?.toLowerCase() === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [search, loans, activeTab]);

  return (
    <View style={styles.mainContainer}>
      <TextInput
        placeholder="Buscar por nome do cliente..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={theme.colors.purpleSecondary}
        style={styles.searchInput}
      />

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {STATUS_FILTERS.map(status => {
            const isActive = activeTab === status;
            return (
              <Pressable
                key={status}
                onPress={() => setActiveTab(status)}
                style={[styles.tabItem, isActive && { backgroundColor: getStatusColor(status), borderColor: getStatusColor(status) }]}>
                <CustomText text={status} weight={isActive ? 'bold' : 'regular'} color={isActive ? '#fff' : theme.colors.purpleSecondary} fontSize="sm" />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredLoans}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <Pressable style={[styles.loanCard, {borderLeftColor: getStatusColor(item.status)}]} onPress={() => setSelectedLoan(item)}>
            <FontAwesome6 name="money-bill-transfer" size={20} color={theme.colors.green} />
            <View style={styles.infos}>
              <View style={styles.headerItem}>
                <CustomText text={item.customers?.name ?? 'Cliente'} weight="bold" fontSize="md" />
                <View style={[styles.tag, {backgroundColor: getStatusColor(item.status)}]}>
                  <CustomText text={item.status ?? ''} fontSize="xs" color="#fff" weight="bold" />
                </View>
              </View>
              <CustomText text={formatFriendlyDate(item.created_at)} fontSize="sm" color={theme.colors.purpleSecondary} />
            </View>
            <CustomText fontSize="md" weight="bold" text={Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} color={theme.colors.green} />
          </Pressable>
        )}
      />

      <Pressable style={styles.fab} onPress={() => setIsAddModalVisible(true)}>
        <FontAwesome6 name="plus" size={24} color="#fff" />
      </Pressable>

      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <Pressable style={{flex: 1}} onPress={resetAddModal} />
          <View style={styles.modalContent}>
            {/* keyboardShouldPersistTaps="handled" resolve o problema do clique no cliente */}
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              keyboardShouldPersistTaps="handled" 
            >
              <View style={styles.dragIndicator} />
              <CustomText text="Novo Empréstimo" fontSize="lg" weight="bold" style={{marginBottom: theme.spacing.sm}} />

              {!selectedCustomer ? (
                <View>
                  <CustomText text="Buscar Cliente (Nome ou Telefone)" fontSize="sm" weight="bold" color={theme.colors.purpleSecondary} />
                  <TextInput
                    placeholder="Comece a digitar..."
                    value={customerSearch}
                    onChangeText={setCustomerSearch}
                    style={styles.modalInput}
                  />
                  {foundCustomers.map(c => (
                    <Pressable 
                      key={c.id} 
                      onPress={() => {
                        setSelectedCustomer(c);
                        Keyboard.dismiss(); // Fecha o teclado ao selecionar
                      }} 
                      style={styles.customerResult}
                    >
                      <FontAwesome6 name="user" size={14} color={theme.colors.green} />
                      <CustomText text={`${c.name} (${c.celular})`} fontSize="md" />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.form}>
                  <View style={styles.selectedCustomerBox}>
                    <CustomText text="Cliente Selecionado:" fontSize="xs" color={theme.colors.purpleSecondary} />
                    <CustomText text={selectedCustomer.name ?? ''} weight="bold" fontSize="md" />
                    <Pressable onPress={() => setSelectedCustomer(null)}>
                      <CustomText text="Trocar cliente" color={theme.colors.danger} fontSize="xs" weight="bold" />
                    </Pressable>
                  </View>

                  <CustomText text="Valor (R$)" fontSize="xs" color={theme.colors.purpleSecondary} />
                  <TextInput
                    placeholder="0,00"
                    keyboardType="numeric"
                    value={loanForm.valor}
                    onChangeText={t => setLoanForm({...loanForm, valor: t})}
                    style={styles.modalInput}
                  />

                  <CustomText text="Juros mensais (%)" fontSize="xs" color={theme.colors.purpleSecondary} />
                  <TextInput
                    placeholder="Ex: 10"
                    keyboardType="numeric"
                    value={loanForm.juros}
                    onChangeText={t => setLoanForm({...loanForm, juros: t})}
                    style={styles.modalInput}
                  />

                  {/* Campo de Cobrança adicionado */}
                  <CustomText text="Frequência de cobrança" fontSize="xs" weight="bold" color={theme.colors.purpleSecondary} />
                  <View style={styles.tabsRow}>
                    {COBRANCA_OPTIONS.map(f => (
                      <Pressable
                        key={f}
                        onPress={() => setLoanForm({...loanForm, cobranca: f})}
                        style={[
                          styles.tabItemForm,
                          loanForm.cobranca === f && { backgroundColor: theme.colors.green, borderColor: theme.colors.green }
                        ]}
                      >
                        <CustomText 
                          text={f.charAt(0).toUpperCase() + f.slice(1)} 
                          color={loanForm.cobranca === f ? "#fff" : theme.colors.purpleSecondary}
                          fontSize="xs"
                          weight="bold"
                        />
                      </Pressable>
                    ))}
                  </View>

                  <CustomButton text="Emprestar" onPress={handleCreateLoan} />
                </View>
              )}
              <CustomButton text="Cancelar" onPress={resetAddModal} backgroundColor="transparent" textColor={theme.colors.danger} style={{marginTop: 10}} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal visible={!!selectedLoan} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <CustomButton onPress={() => setSelectedLoan(null)} />
          <View style={styles.modalContent}>
            {selectedLoan && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.dragIndicator} />
                <CustomText text="Detalhes do Empréstimo" fontSize="lg" weight="bold" />
                <View style={styles.detailRow}><CustomText text="Cliente:" weight="bold" /><CustomText text={selectedLoan.customers?.name ?? 'N/A'} /></View>
                <View style={styles.detailRow}><CustomText text="Data:" weight="bold" /><CustomText text={formatFriendlyDate(selectedLoan.created_at)} /></View>
                <View style={styles.detailRow}><CustomText text="Valor:" weight="bold" /><CustomText text={`R$ ${Number(selectedLoan.valor).toFixed(2)}`} /></View>
                <View style={styles.detailRow}><CustomText text="Cobrança:" weight="bold" /><CustomText text={selectedLoan.cobranca ?? 'N/A'} /></View>
                <CustomButton onPress={() => setSelectedLoan(null)} text="Fechar" />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, padding: theme.spacing.md },
  searchInput: {
    backgroundColor: '#fff', padding: 14, borderRadius: theme.borderRadius.md, marginBottom: 12, elevation: 2,
  },
  tabsContainer: { marginBottom: 16 },
  tabsScroll: { gap: 8, paddingVertical: 4 },
  tabItem: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center',
  },
  listContent: { paddingBottom: 80 },
  loanCard: {
    backgroundColor: '#fff', borderRadius: theme.borderRadius.lg, paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12, borderLeftWidth: 6, marginBottom: 12,
    elevation: 3,
  },
  infos: {flex: 1, gap: 2},
  headerItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
  tag: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6},
  fab: {
    position: 'absolute', bottom: 24, right: 24, backgroundColor: theme.colors.green,
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8,
  },
  modalWrapper: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24,
    maxHeight: '90%', width: '100%', elevation: 25,
  },
  dragIndicator: { width: 40, height: 5, backgroundColor: '#e0e0e0', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  modalInput: {
    borderBottomWidth: 1, borderBottomColor: theme.colors.green, paddingVertical: 10,
    fontSize: 16, marginBottom: 20, color: '#333',
  },
  customerResult: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  selectedCustomerBox: {
    backgroundColor: theme.colors.page, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, gap: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  tabsRow: {
    flexDirection: 'row', gap: 8,
    marginBottom: theme.spacing.sm
  },
  tabItemForm: {
    flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#F8F9FA',
    borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center',
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  form: { gap: 5 }
});