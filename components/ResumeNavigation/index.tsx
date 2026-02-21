import {StyleSheet, View} from 'react-native';
import {theme} from '../../themes';
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';
import {MaterialIcons} from '@expo/vector-icons';
import {useAppNavigation} from '../../hooks/useAppNavigation';

export default function ResumeNavigation() {
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topContent}>
          <CustomText text="Total a Receber" color={theme.colors.primary} />
          <CustomText
            text="R$ 200.00"
            fontSize="lg"
            weight="bold"
            color={theme.colors.primary}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomButton}>
          <CustomButton
            widthVariant={50}
            heightVariant={50}
            iconName="auto-graph"
            iconSize={24}
            onPress={() => navigation.navigate('dashboard')}
          />
          <CustomText text="Dashboard" color={theme.colors.primary} />
        </View>
        <View style={styles.bottomButton}>
          <CustomButton
            widthVariant={50}
            heightVariant={50}
            iconName="person-search"
            iconSize={24}
            onPress={() => navigation.navigate('customers')}
          />
          <CustomText text="Clientes" color={theme.colors.primary} />
        </View>
        <View style={styles.bottomButton}>
          <CustomButton
            widthVariant={50}
            heightVariant={50}
            iconName="attach-money"
            IconLibrary={MaterialIcons}
            iconSize={24}
            onPress={() => navigation.navigate('loans')}
          />
          <CustomText text="Empréstimos" color={theme.colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    boxShadow: theme.boxShadow.sm,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    position: 'absolute',
    top: 140,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 2,
  },
  top: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.border.default,
  },
  topContent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
});
