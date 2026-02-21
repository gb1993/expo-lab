import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import CustomButton from '../CustomButton';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {theme} from '../../themes';
import CustomText from '../CustomText';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Loan {
  customerName: string;
  loanDateTime: string;
  loanValue: string;
}

const lastLoans: Loan[] = [
  {
    customerName: 'Fulano de tal',
    loanDateTime: '20/02/2026 23:57',
    loanValue: 'R$ 1000,50',
  },
  {
    customerName: 'Fulano de tal',
    loanDateTime: '20/02/2026 23:57',
    loanValue: 'R$ 1000,50',
  },
  {
    customerName: 'Fulano de tal',
    loanDateTime: '20/02/2026 23:57',
    loanValue: 'R$ 1000,50',
  },
];

export default function LastsLoans() {
  const navigation = useAppNavigation();

  if (lastLoans.length === 0) {
    return (
      <View>
        <Text>Nenhum empréstimo realizado</Text>
        <CustomButton
          onPress={() => navigation.navigate('loans')}
          text="Realize seu primeiro aqui"
        />
      </View>
    );
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('loans')}>
      <CustomText
        text="Últimos empréstimos"
        color={theme.colors.purpleSecondary}
        fontSize="lg"
        weight="bold"
      />

      {lastLoans.map((loan, index) => (
        <View style={styles.content} key={`${loan.loanDateTime}-${index}`}>
          <FontAwesome6
            name="money-bill-transfer"
            size={24}
            color={theme.colors.purpleSecondary}
          />
          <View>
            <Text>{loan.customerName}</Text>
            <Text>{loan.loanDateTime}</Text>
          </View>
          <Text>{loan.loanValue}</Text>
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: theme.width.container,
    alignSelf: 'center',
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  content: {
    backgroundColor: theme.colors.secondary,
    boxShadow: theme.boxShadow.md,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
