import {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {format, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import {supabase} from '../../lib/supabase';
import CustomButton from '../CustomButton';
import CustomText from '../CustomText';
import {theme} from '../../themes';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {Database} from '../../database.types';

type LoanRow = Database['public']['Tables']['loans']['Row'] & {
  customer?: {name: string} | null;
};

export default function LastLoans() {
  const navigation = useAppNavigation();
  const [loans, setLoans] = useState<LoanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanRow | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('loans')
        .select(`*, customer:customer_id(name)`)
        .order('created_at', {ascending: false})
        .limit(3);

      if (error) {
        console.error('Erro ao buscar loans:', error);
        return;
      }
      setLoans(data ?? []);
    } catch (err) {
      console.error('Erro inesperado ao buscar loans:', err);
    } finally {
      setLoading(false);
    }
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
      case 'pendente':
      case 'ativo':
        return theme.colors.alert;
      case 'finalizado':
        return theme.colors.success;
      case 'atrasado':
        return theme.colors.danger;
      default:
        return theme.colors.secondary;
    }
  }

  function LoanItem({loan}: {loan: LoanRow}) {
    const statusColor = getStatusColor(loan.status);
    return (
      <Pressable
        style={[styles.content, {borderLeftColor: statusColor}]}
        onPress={() => setSelectedLoan(loan)}>
        <FontAwesome6
          name="money-bill-transfer"
          size={24}
          color={theme.colors.green}
        />
        <View style={styles.infos}>
          <View style={styles.headerItem}>
            <CustomText
              text={loan.customer?.name ?? 'Cliente'}
              weight="bold"
              fontSize="md"
            />
            <View style={[styles.tag, {backgroundColor: statusColor}]}>
              <CustomText
                text={loan.status ?? ''}
                fontSize="xs"
                color="#fff"
                weight="bold"
              />
            </View>
          </View>
          <CustomText
            text={formatFriendlyDate(loan.created_at)}
            fontSize="sm"
            color={theme.colors.purpleSecondary}
          />
        </View>
        <CustomText
          fontSize="md"
          weight="bold"
          text={Number(loan.valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          color={theme.colors.green}
        />
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.green} />
        <CustomText text="Carregando..." fontSize="lg" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={loans}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <CustomText
            text="Últimos empréstimos"
            color={theme.colors.purpleSecondary}
            fontSize="lg"
            weight="bold"
            style={{marginBottom: theme.spacing.md}}
          />
        }
        renderItem={({item}) => <LoanItem loan={item} />}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CustomText
              text="Nenhum empréstimo realizado"
              color={theme.colors.purpleSecondary}
              fontSize="lg"
              weight="bold"
            />
            <CustomButton
              onPress={() => navigation.navigate('loans')}
              text="Realize seu primeiro aqui"
              textColor={theme.colors.secondary}
            />
          </View>
        }
      />

      <Modal
        visible={!!selectedLoan}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedLoan(null)}>
        <View style={styles.modalWrapper}>
          {/* Clicar na área transparente acima da caixa fecha o modal */}
          <Pressable style={{flex: 1}} onPress={() => setSelectedLoan(null)} />

          <View style={styles.modalContent}>
            {selectedLoan && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.dragIndicator} />

                <CustomText
                  text={`Detalhes do Empréstimo`}
                  fontSize="lg"
                  weight="bold"
                  style={{marginBottom: 20}}
                />

                <View style={styles.detailRow}>
                  <CustomText text="Cliente:" weight="bold" />
                  <CustomText text={selectedLoan.customer?.name ?? 'N/A'} />
                </View>

                <View style={styles.detailRow}>
                  <CustomText text="Data:" weight="bold" />
                  <CustomText
                    text={formatFriendlyDate(selectedLoan.created_at)}
                  />
                </View>

                <View style={styles.detailRow}>
                  <CustomText text="Valor Original:" weight="bold" />
                  <CustomText
                    text={`R$ ${Number(selectedLoan.valor).toFixed(2)}`}
                  />
                </View>

                <View style={styles.detailRow}>
                  <CustomText text="Juros:" weight="bold" />
                  <CustomText
                    text={`${(Number(selectedLoan.juros) * 100).toFixed(2)}%`}
                  />
                </View>

                <View style={styles.detailRow}>
                  <CustomText text="Status:" weight="bold" />
                  <CustomText
                    text={selectedLoan.status ?? ''}
                    color={getStatusColor(selectedLoan.status)}
                    weight="bold"
                  />
                </View>

                <CustomButton
                  onPress={() => setSelectedLoan(null)}
                  text="Fechar"
                  textColor="#fff"
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
  container: {
    width: theme.width.container,
    alignSelf: 'center',
    marginTop: theme.spacing.xxl,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  content: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
    borderLeftWidth: 6,
    marginBottom: theme.spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infos: {flex: 1, gap: 4},
  headerItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
  tag: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6},

  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', // Garantindo que não haja overlay
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: theme.spacing.xl,
    borderTopRightRadius: theme.spacing.xl,
    padding: theme.spacing.xl,
    maxHeight: '80%',
    width: '100%',

    // BOX SHADOW SUPERIOR
    // Para iOS:
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10, // Sombra para cima
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    // Para Android:
    elevation: 20, // O elevation no Android é limitado, mas cria a profundidade necessária
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});
