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

type AgreementRow = Database['public']['Tables']['agreements']['Row'];
type CustomerRow = Database['public']['Tables']['customers']['Row'];
type LoanRow = Database['public']['Tables']['loans']['Row'];
type AgreementInsert = Database['public']['Tables']['agreements']['Insert'];

type AgreementWithRelations = AgreementRow & {
  customers: Pick<CustomerRow, 'name'> | null;
  loans: Pick<LoanRow, 'valor' | 'status' | 'created_at'> | null;
};

export default function Agreement() {
  const [agreements, setAgreements] = useState<AgreementWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAgreement, setSelectedAgreement] =
    useState<AgreementWithRelations | null>(null);

  // Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [foundCustomers, setFoundCustomers] = useState<CustomerRow[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(
    null,
  );
  const [customerLoans, setCustomerLoans] = useState<LoanRow[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanRow | null>(null);

  const [agreementForm, setAgreementForm] = useState({
    valor: '',
    data_acordo: format(new Date(), 'yyyy-MM-dd'),
    data_acordo_display: format(new Date(), 'dd/MM/yyyy'),
  });

  useEffect(() => {
    fetchAgreements();
  }, []);

  useEffect(() => {
    if (customerSearch.length > 2) {
      searchCustomers();
    } else {
      setFoundCustomers([]);
    }
  }, [customerSearch]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerLoans(selectedCustomer.id);
    } else {
      setCustomerLoans([]);
      setSelectedLoan(null);
    }
  }, [selectedCustomer]);

  async function fetchAgreements() {
    setLoading(true);
    const {data, error} = await supabase
      .from('agreements')
      .select(`*, customers (name), loans (valor, status, created_at)`)
      .order('created_at', {ascending: false});

    if (!error) setAgreements(data ?? []);
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

  async function fetchCustomerLoans(customerId: string) {
    const {data} = await supabase
      .from('loans')
      .select('*')
      .eq('customer_id', customerId)
      .in('status', ['ativo', 'atrasado']); // Permite acordo para ativos e atrasados

    setCustomerLoans(data ?? []);
  }

  async function handleCreateAgreement() {
    if (
      !selectedCustomer ||
      !selectedLoan ||
      !agreementForm.valor ||
      !agreementForm.data_acordo
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const newAgreement: AgreementInsert = {
      customer_id: selectedCustomer.id,
      loan_id: selectedLoan.id,
      valor: parseFloat(agreementForm.valor.replace(',', '.')),
      data_acordo: agreementForm.data_acordo,
    };

    const {error} = await supabase.from('agreements').insert([newAgreement]);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      // Atualiza o status do empréstimo para 'acordo'
      const {error: updateError} = await supabase
        .from('loans')
        .update({status: 'acordo'})
        .eq('id', selectedLoan.id);

      if (updateError) {
        Alert.alert(
          'Aviso',
          'Acordo salvo, mas não foi possível atualizar o status do empréstimo.',
        );
      } else {
        Alert.alert('Sucesso', 'Acordo criado com sucesso!');
      }

      resetAddModal();
      fetchAgreements();
    }
  }

  function resetAddModal() {
    setIsAddModalVisible(false);
    setSelectedCustomer(null);
    setSelectedLoan(null);
    setCustomerSearch('');
    setAgreementForm({
      valor: '',
      data_acordo: format(new Date(), 'yyyy-MM-dd'),
      data_acordo_display: format(new Date(), 'dd/MM/yyyy'),
    });
  }

  const formatFriendlyDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', {locale: ptBR});
    } catch (e) {
      return 'Data inválida';
    }
  };

  const formatSimpleDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', {locale: ptBR});
    } catch (e) {
      return dateString;
    }
  };

  const filteredAgreements = useMemo(() => {
    return agreements.filter((agreement) => {
      return agreement.customers?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [search, agreements]);

  return (
    <View style={styles.mainContainer}>
      <TextInput
        placeholder="Buscar por nome do cliente..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={theme.colors.purpleSecondary}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredAgreements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <Pressable
            style={styles.card}
            onPress={() => setSelectedAgreement(item)}>
            <FontAwesome6
              name="handshake"
              size={20}
              color={theme.colors.green}
            />
            <View style={styles.infos}>
              <View style={styles.headerItem}>
                <CustomText
                  text={item.customers?.name ?? 'Cliente'}
                  weight="bold"
                  fontSize="md"
                />
              </View>
              <CustomText
                text={`Acordo em ${formatSimpleDate(item.data_acordo)}`}
                fontSize="sm"
                color={theme.colors.purpleSecondary}
              />
            </View>
            <CustomText
              fontSize="md"
              weight="bold"
              text={Number(item.valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
              color={theme.colors.green}
            />
          </Pressable>
        )}
      />

      <Pressable style={styles.fab} onPress={() => setIsAddModalVisible(true)}>
        <FontAwesome6 name="plus" size={24} color="#fff" />
      </Pressable>

      {/* Modal Criar Acordo */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <Pressable style={{flex: 1}} onPress={resetAddModal} />
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View style={styles.dragIndicator} />
              <CustomText
                text="Novo Acordo"
                fontSize="lg"
                weight="bold"
                style={{marginBottom: theme.spacing.sm}}
              />

              {!selectedCustomer ? (
                <View>
                  <CustomText
                    text="Buscar Cliente (Nome ou Telefone)"
                    fontSize="sm"
                    weight="bold"
                    color={theme.colors.purpleSecondary}
                  />
                  <TextInput
                    placeholder="Comece a digitar..."
                    value={customerSearch}
                    onChangeText={setCustomerSearch}
                    style={styles.modalInput}
                  />
                  {foundCustomers.map((c) => (
                    <Pressable
                      key={c.id}
                      onPress={() => {
                        setSelectedCustomer(c);
                        Keyboard.dismiss();
                      }}
                      style={styles.customerResult}>
                      <FontAwesome6
                        name="user"
                        size={14}
                        color={theme.colors.green}
                      />
                      <CustomText
                        text={`${c.name} (${c.celular})`}
                        fontSize="md"
                      />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.form}>
                  <View style={styles.selectedBox}>
                    <CustomText
                      text="Cliente Selecionado:"
                      fontSize="xs"
                      color={theme.colors.purpleSecondary}
                    />
                    <CustomText
                      text={selectedCustomer.name ?? ''}
                      weight="bold"
                      fontSize="md"
                    />
                    <Pressable onPress={() => setSelectedCustomer(null)}>
                      <CustomText
                        text="Trocar cliente"
                        color={theme.colors.danger}
                        fontSize="xs"
                        weight="bold"
                      />
                    </Pressable>
                  </View>

                  {!selectedLoan ? (
                    <View>
                      <CustomText
                        text="Selecione um Empréstimo"
                        fontSize="sm"
                        weight="bold"
                        color={theme.colors.purpleSecondary}
                        style={{marginBottom: 10}}
                      />
                      {customerLoans.length === 0 ? (
                        <CustomText
                          text="Nenhum empréstimo ativo encontrado para este cliente."
                          color={theme.colors.danger}
                          fontSize="sm"
                        />
                      ) : (
                        customerLoans.map((loan) => (
                          <Pressable
                            key={loan.id}
                            onPress={() => setSelectedLoan(loan)}
                            style={styles.loanResult}>
                            <FontAwesome6
                              name="money-bill-transfer"
                              size={14}
                              color={theme.colors.green}
                            />
                            <View>
                              <CustomText
                                text={`Empréstimo: R$ ${Number(
                                  loan.valor,
                                ).toFixed(2)}`}
                                fontSize="md"
                              />
                              <CustomText
                                text={`Data: ${formatSimpleDate(
                                  loan.created_at,
                                )}`}
                                fontSize="xs"
                                color={theme.colors.purpleSecondary}
                              />
                            </View>
                          </Pressable>
                        ))
                      )}
                    </View>
                  ) : (
                    <View>
                      <View style={styles.selectedBox}>
                        <CustomText
                          text="Empréstimo Selecionado:"
                          fontSize="xs"
                          color={theme.colors.purpleSecondary}
                        />
                        <CustomText
                          text={`R$ ${Number(selectedLoan.valor).toFixed(2)}`}
                          weight="bold"
                          fontSize="md"
                        />
                        <Pressable onPress={() => setSelectedLoan(null)}>
                          <CustomText
                            text="Trocar empréstimo"
                            color={theme.colors.danger}
                            fontSize="xs"
                            weight="bold"
                          />
                        </Pressable>
                      </View>

                      <CustomText
                        text="Valor do Acordo (R$)"
                        fontSize="xs"
                        color={theme.colors.purpleSecondary}
                      />
                      <TextInput
                        placeholder="0,00"
                        keyboardType="numeric"
                        value={agreementForm.valor}
                        onChangeText={(t) =>
                          setAgreementForm({...agreementForm, valor: t})
                        }
                        style={styles.modalInput}
                      />

                      <CustomText
                        text="Data do Acordo (DD/MM/YYYY)"
                        fontSize="xs"
                        color={theme.colors.purpleSecondary}
                      />
                      <TextInput
                        placeholder="DD/MM/YYYY"
                        value={agreementForm.data_acordo_display}
                        onChangeText={(t) => {
                          // Simple date mask logic or direct input
                          let formatted = t.replace(/\D/g, '');
                          if (formatted.length > 2) {
                            formatted =
                              formatted.slice(0, 2) + '/' + formatted.slice(2);
                          }
                          if (formatted.length > 5) {
                            formatted =
                              formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
                          }
                          
                          let isoDate = agreementForm.data_acordo;
                          if (formatted.length === 10) {
                             const [d, m, y] = formatted.split('/');
                             isoDate = `${y}-${m}-${d}`;
                          }

                          setAgreementForm({
                            ...agreementForm,
                            data_acordo_display: formatted,
                            data_acordo: isoDate,
                          });
                        }}
                        keyboardType="number-pad"
                        maxLength={10}
                        style={styles.modalInput}
                      />

                      <CustomButton
                        text="Registrar Acordo"
                        onPress={handleCreateAgreement}
                      />
                    </View>
                  )}
                </View>
              )}
              <CustomButton
                text="Cancelar"
                onPress={resetAddModal}
                backgroundColor="transparent"
                textColor={theme.colors.danger}
                style={{marginTop: 10}}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Detalhes */}
      <Modal visible={!!selectedAgreement} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <CustomButton onPress={() => setSelectedAgreement(null)} />
          <View style={styles.modalContent}>
            {selectedAgreement && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.dragIndicator} />
                <CustomText
                  text="Detalhes do Acordo"
                  fontSize="lg"
                  weight="bold"
                />
                <View style={styles.detailRow}>
                  <CustomText text="Cliente:" weight="bold" />
                  <CustomText text={selectedAgreement.customers?.name ?? 'N/A'} />
                </View>
                <View style={styles.detailRow}>
                  <CustomText text="Data de Registro:" weight="bold" />
                  <CustomText
                    text={formatFriendlyDate(selectedAgreement.created_at)}
                  />
                </View>
                <View style={styles.detailRow}>
                  <CustomText text="Data do Acordo:" weight="bold" />
                  <CustomText
                    text={formatSimpleDate(selectedAgreement.data_acordo)}
                  />
                </View>
                <View style={styles.detailRow}>
                  <CustomText text="Valor Acordado:" weight="bold" />
                  <CustomText
                    text={`R$ ${Number(selectedAgreement.valor).toFixed(2)}`}
                  />
                </View>
                <View style={styles.detailRow}>
                  <CustomText text="Empréstimo Origem:" weight="bold" />
                  <CustomText
                    text={
                      selectedAgreement.loans
                        ? `R$ ${Number(selectedAgreement.loans.valor).toFixed(2)}`
                        : 'N/A'
                    }
                  />
                </View>
                <CustomButton
                  onPress={() => setSelectedAgreement(null)}
                  text="Fechar"
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, padding: theme.spacing.md},
  searchInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
    elevation: 2,
  },
  listContent: {paddingBottom: 80},
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.green,
    marginBottom: 12,
    elevation: 3,
  },
  infos: {flex: 1, gap: 2},
  headerItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: theme.colors.green,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
    width: '100%',
    elevation: 25,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.green,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  customerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  loanResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedBox: {
    backgroundColor: theme.colors.page,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  form: {gap: 5},
});
