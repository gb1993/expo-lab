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
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {supabase} from '../lib/supabase';
import {Database} from '../database.types';
import {theme} from '../themes';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import {useAppNavigation} from '../hooks/useAppNavigation';

type CustomerRow = Database['public']['Tables']['customers']['Row'];
type LoanRow = Database['public']['Tables']['loans']['Row'];

type CustomerWithLoans = CustomerRow & {
  loans: LoanRow[];
};

export default function Customers() {
  const navigation = useAppNavigation();
  const [customers, setCustomers] = useState<CustomerWithLoans[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Estados para Edição e Novo Cliente
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithLoans | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CustomerRow>>({});

  // Estado para Modal de Novo Cliente
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    celular: '',
    address: '',
    referencia: '', // Novo campo adicionado
  });

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
    return customers.filter(c =>
      (c.name ?? '').toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, customers]);

  async function handleUpdateCustomer() {
    if (!selectedCustomer) return;
    const {error} = await supabase
      .from('customers')
      .update(editData)
      .eq('id', selectedCustomer.id);

    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    } else {
      Alert.alert('Sucesso', 'Cliente atualizado!');
      setIsEditing(false);
      fetchCustomers();
      setSelectedCustomer(prev => (prev ? {...prev, ...editData} : null));
    }
  }

  // Criar novo cliente e redirecionar para CreateLoan
  async function handleCreateAndLoan() {
    if (!newCustomerData.name.trim() || !newCustomerData.celular.trim()) {
      Alert.alert('Atenção', 'Nome e Celular são obrigatórios.');
      return;
    }

    setLoading(true);

    // 1. Pegar o usuário logado
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      setLoading(false);
      return;
    }

    // 2. Incluir o user_id nos dados do novo cliente
    const {data, error} = await supabase
      .from('customers')
      .insert([{...newCustomerData, user_id: user.id}]) // <-- Adicione aqui
      .select()
      .single();

    if (error) {
      setLoading(false);
      Alert.alert('Erro', 'Erro ao cadastrar cliente: ' + error.message);
      return;
    }

    setIsAddModalVisible(false);
    setNewCustomerData({name: '', celular: '', address: '', referencia: ''});
    fetchCustomers();

    // Navega para criar empréstimo com o ID do novo cliente
    navigation.navigate('CreateLoan', {customerId: data.id});
  }

  function getStatusColor(status: string | null) {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return theme.colors.alert;
      case 'finalizado':
        return theme.colors.success;
      case 'atrasado':
        return theme.colors.danger;
      default:
        return theme.colors.purpleSecondary;
    }
  }

  if (loading && customers.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.green} />
        <CustomText text="Carregando clientes..." />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <TextInput
        placeholder="Buscar cliente pelo nome..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={theme.colors.purpleSecondary}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              setSelectedCustomer(item);
              setEditData(item);
              setIsEditing(false);
            }}
            style={styles.customerCard}>
            <View style={styles.customerIcon}>
              <FontAwesome6
                name="user-large"
                size={18}
                color={theme.colors.green}
              />
            </View>
            <View style={styles.infos}>
              <CustomText text={item.name ?? ''} weight="bold" fontSize="md" />
              <CustomText
                text={item.celular ?? 'Sem celular'}
                fontSize="sm"
                color={theme.colors.purpleSecondary}
              />
            </View>
            <FontAwesome6 name="chevron-right" size={12} color="#ccc" />
          </Pressable>
        )}
      />

      {/* FAB - Botão Flutuante */}
      <Pressable style={styles.fab} onPress={() => setIsAddModalVisible(true)}>
        <FontAwesome6 name="plus" size={24} color="#fff" />
      </Pressable>

      {/* Modal Adicionar Novo Cliente */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <Pressable
            style={{flex: 1}}
            onPress={() => setIsAddModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dragIndicator} />
              <CustomText
                text="Novo Cliente"
                fontSize="lg"
                weight="bold"
                style={{marginBottom: 20}}
              />

              <View style={styles.form}>
                <CustomText
                  text="Nome completo *"
                  fontSize="xs"
                  color={theme.colors.purpleSecondary}
                />
                <TextInput
                  placeholder="Nome do cliente"
                  value={newCustomerData.name}
                  onChangeText={t =>
                    setNewCustomerData({...newCustomerData, name: t})
                  }
                  style={styles.input}
                />

                <CustomText
                  text="Celular *"
                  fontSize="xs"
                  color={theme.colors.purpleSecondary}
                />
                <TextInput
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  value={newCustomerData.celular}
                  onChangeText={t =>
                    setNewCustomerData({...newCustomerData, celular: t})
                  }
                  style={styles.input}
                />

                <CustomText
                  text="Endereço"
                  fontSize="xs"
                  color={theme.colors.purpleSecondary}
                />
                <TextInput
                  placeholder="Rua, Número, Bairro"
                  value={newCustomerData.address}
                  onChangeText={t =>
                    setNewCustomerData({...newCustomerData, address: t})
                  }
                  style={styles.input}
                />

                <CustomText
                  text="Referência (Opcional)"
                  fontSize="xs"
                  color={theme.colors.purpleSecondary}
                />
                <TextInput
                  placeholder="Por onde nos encontrou?"
                  value={newCustomerData.referencia}
                  onChangeText={t =>
                    setNewCustomerData({...newCustomerData, referencia: t})
                  }
                  style={styles.input}
                />
              </View>

              <CustomButton
                text="Salvar e Gerar Empréstimo"
                onPress={handleCreateAndLoan}
              />
              <CustomButton
                onPress={() => setIsAddModalVisible(false)}
                text="Cancelar"
                backgroundColor="transparent"
                textColor={theme.colors.danger}
                style={{marginTop: 8}}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Detalhes/Edição */}
      <Modal visible={!!selectedCustomer} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <Pressable
            style={{flex: 1}}
            onPress={() => setSelectedCustomer(null)}
          />
          <View style={styles.modalContent}>
            {selectedCustomer && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.dragIndicator} />
                <View style={styles.modalHeader}>
                  <CustomText
                    text={
                      isEditing
                        ? 'Editando Cliente'
                        : (selectedCustomer.name ?? '')
                    }
                    fontSize="lg"
                    weight="bold"
                  />
                  <Pressable onPress={() => setIsEditing(!isEditing)}>
                    <FontAwesome6
                      name={isEditing ? 'xmark' : 'user-pen'}
                      size={20}
                      color={theme.colors.green}
                    />
                  </Pressable>
                </View>

                <View style={styles.form}>
                  <CustomText
                    text="Nome completo"
                    fontSize="xs"
                    color={theme.colors.purpleSecondary}
                  />
                  <TextInput
                    editable={isEditing}
                    value={editData.name ?? ''}
                    onChangeText={t => setEditData({...editData, name: t})}
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                  />
                  <CustomText
                    text="Celular"
                    fontSize="xs"
                    color={theme.colors.purpleSecondary}
                  />
                  <TextInput
                    editable={isEditing}
                    value={editData.celular ?? ''}
                    onChangeText={t => setEditData({...editData, celular: t})}
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                  />
                  <CustomText
                    text="Endereço"
                    fontSize="xs"
                    color={theme.colors.purpleSecondary}
                  />
                  <TextInput
                    editable={isEditing}
                    value={editData.address ?? ''}
                    onChangeText={t => setEditData({...editData, address: t})}
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                  />
                  <CustomText
                    text="Referência"
                    fontSize="xs"
                    color={theme.colors.purpleSecondary}
                  />
                  <TextInput
                    editable={isEditing}
                    value={editData.referencia ?? ''}
                    onChangeText={t =>
                      setEditData({...editData, referencia: t})
                    }
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                  />
                </View>

                {isEditing ? (
                  <CustomButton
                    text="Confirmar Alterações"
                    onPress={handleUpdateCustomer}
                  />
                ) : (
                  <>
                    <CustomButton
                      text="Novo Empréstimo"
                      onPress={() => {
                        setSelectedCustomer(null);
                        navigation.navigate('CreateLoan', {
                          customerId: selectedCustomer.id,
                        });
                      }}
                    />
                    <CustomText
                      text="Histórico"
                      weight="bold"
                      style={{marginTop: 20, marginBottom: 10}}
                    />
                    {selectedCustomer.loans.map(loan => (
                      <View
                        key={loan.id}
                        style={[
                          styles.loanItem,
                          {borderLeftColor: getStatusColor(loan.status)},
                        ]}>
                        <CustomText
                          text={`R$ ${Number(loan.valor).toFixed(2)}`}
                          weight="bold"
                        />
                        <CustomText
                          text={loan.status ?? ''}
                          fontSize="xs"
                          color={getStatusColor(loan.status)}
                          weight="bold"
                        />
                      </View>
                    ))}
                  </>
                )}
                <CustomButton
                  onPress={() => setSelectedCustomer(null)}
                  text="Fechar"
                  backgroundColor="transparent"
                  textColor={theme.colors.purpleSecondary}
                  style={styles.closeBtn}
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
  centerContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  searchInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  listContent: {flex: 1, paddingBottom: 80},
  customerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  customerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infos: {flex: 1},
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
  modalWrapper: {flex: 1, justifyContent: 'flex-end'},
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  form: {gap: 10, marginBottom: 20},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.green,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    borderBottomColor: '#eee',
    color: '#666',
  },
  loanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  closeBtn: {
    borderColor: theme.colors.purpleSecondary,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    marginTop: 10,
  },
});
