import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import CustomButton from '../CustomButton';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {theme} from '../../themes';
import CustomText from '../CustomText';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Loan {
  customerName: string;
  loanDateTime: string;
  loanValue: number; // Alterado para number para melhor formatação
}

const lastLoans: Loan[] = [
  {
    customerName: 'Fulano de tal',
    loanDateTime: '20/02/2026 23:57',
    loanValue: 1000.5,
  },
  {
    customerName: 'Fulano de tal',
    loanDateTime: '20/02/2026 23:57',
    loanValue: 1000.5,
  },
  {
    customerName: 'Fulano de tal',
    loanDateTime: '20/02/2026 23:57',
    loanValue: 1000.5,
  },
];

// Componente individual do item
function LoanItem({loan}: {loan: Loan}) {
  const navigation = useAppNavigation();

  return (
    <Pressable
      style={styles.content}
      onPress={() =>
        navigation.navigate('main', {
          screen: 'loans',
        })
      }>
      <FontAwesome6
        name="money-bill-transfer"
        size={24}
        color={theme.colors.green}
      />
      <View style={styles.infos}>
        <CustomText text={loan.customerName} weight="bold" fontSize="md" />
        <CustomText fontSize="sm" text={loan.loanDateTime} />
      </View>
      <CustomText
        fontSize="md"
        weight="bold"
        text={loan.loanValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
        color={theme.colors.green}
      />
    </Pressable>
  );
}

export default function LastsLoans() {
  const navigation = useAppNavigation();

  if (lastLoans.length === 0) {
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
    <FlatList
      data={lastLoans}
      keyExtractor={(item, index) => `${item.loanDateTime}-${index}`}
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
    boxShadow: theme.boxShadow.md
  },
  infos: {
    flex: 1, // Faz o texto ocupar o espaço disponível
    gap: theme.spacing.xs,
  },
});
