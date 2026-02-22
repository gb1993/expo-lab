import {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Modal,
  ScrollView,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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
    const {data, error} = await supabase
      .from('loans')
      .select(
        `
        *,
        customer:customer_id(name)
      `,
      )
      .order('data_solicitacao', {ascending: false})
      .limit(3); // Apenas os últimos 3

    if (error) console.log(error);
    else setLoans(data ?? []);

    setLoading(false);
  }

  function calculateTotalWithInterest(loan: LoanRow) {
    return Number(loan.valor) * (1 + Number(loan.juros));
  }

  function getStatusColor(status: string | null) {
    switch (status) {
      case 'pendente':
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
    return (
      <Pressable
        style={[styles.content, {borderLeftColor: getStatusColor(loan.status)}]}
        onPress={() => setSelectedLoan(loan)}>
        <FontAwesome6
          name="money-bill-transfer"
          size={24}
          color={theme.colors.green}
        />
        <View style={styles.infos}>
          <CustomText
            text={loan.customer?.name ?? 'Cliente'}
            weight="bold"
            fontSize="md"
          />
          <CustomText fontSize="sm" text={loan.data_solicitacao ?? ''} />
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CustomText text="Carregando..." fontSize="lg" />
      </View>
    );
  }

  if (loans.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <FlatList
        data={loans}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <CustomText
            text="Últimos empréstimos"
            color={theme.colors.purpleSecondary}
            fontSize="lg"
            weight="bold"
          />
        }
        renderItem={({item}) => <LoanItem loan={item} />}
        contentContainerStyle={styles.container}
      />

      {/* Modal de detalhes do loan */}
      <Modal visible={!!selectedLoan} animationType="slide" transparent>
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
            {selectedLoan && (
              <ScrollView>
                <CustomText
                  text={`Cliente: ${selectedLoan.customer?.name ?? 'Cliente'}`}
                  fontSize="lg"
                  weight="bold"
                />
                <CustomText
                  text={`Valor: R$ ${Number(selectedLoan.valor).toFixed(2)}`}
                />
                <CustomText
                  text={`Juros: ${(selectedLoan.juros * 100).toFixed(2)}%`}
                />
                <CustomText
                  text={`Parcelas: ${selectedLoan.numero_parcelas}`}
                />
                <CustomText
                  text={`Frequência: ${selectedLoan.frequencia_pagamento}`}
                />
                <CustomText
                  text={`Status: ${selectedLoan.status}`}
                  color={getStatusColor(selectedLoan.status)}
                  weight="bold"
                />
                <CustomText
                  text={`Total com juros: R$ ${calculateTotalWithInterest(selectedLoan).toFixed(2)}`}
                  weight="bold"
                />

                <CustomButton
                  onPress={() => setSelectedLoan(null)}
                  text="Fechar"
                  textColor="#fff"
                  style={{marginTop: 20, backgroundColor: theme.colors.green}}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: theme.width.container,
    alignSelf: 'center',
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  emptyContainer: {
    width: theme.width.container,
    alignSelf: 'center',
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.lg,
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
    borderLeftWidth: 5,
    boxShadow: theme.boxShadow.md,
  },
  infos: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
