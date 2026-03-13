import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {theme} from '../../themes';
import CustomText from '../CustomText';
import {useTotalProfit} from '../../hooks/useTotalProfit';

export default function TotalProfit() {
  const {totalProfit, loading} = useTotalProfit();

  const formattedValue = totalProfit.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <View style={styles.container}>
      <CustomText text="Total a Receber" color={theme.colors.primary} />
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.green} />
      ) : (
        <CustomText
          text={formattedValue}
          fontSize="lg"
          weight="bold"
          color={theme.colors.green}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
