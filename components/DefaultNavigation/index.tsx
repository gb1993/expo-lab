import {StyleSheet, View} from 'react-native';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import CustomButton from '../CustomButton';
import {theme} from '../../themes';
import {MaterialIcons} from '@expo/vector-icons';

export default function DefaultNavigation() {
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <CustomButton
        backgroundColor={theme.colors.secondary}
        widthVariant={52}
        heightVariant={52}
        iconName="attach-money"
        IconLibrary={MaterialIcons}
        iconColor={theme.colors.primary}
        iconSize={30}
        onPress={() => navigation.navigate('main', {screen: 'loans'})}
      />
      <CustomButton
        backgroundColor={theme.colors.secondary}
        widthVariant={52}
        heightVariant={52}
        iconName="person-search"
        iconColor={theme.colors.primary}
        iconSize={30}
        onPress={() => navigation.navigate('main', {screen: 'customers'})}
      />
      <CustomButton
        backgroundColor={theme.colors.secondary}
        widthVariant={52}
        heightVariant={52}
        iconName="auto-graph"
        iconSize={30}
        iconColor={theme.colors.primary}
        onPress={() => navigation.navigate('main', {screen: 'dashboard'})}
      />
      <CustomButton
        iconColor={theme.colors.primary}
        backgroundColor={theme.colors.secondary}
        widthVariant={52}
        heightVariant={52}
        iconName="home"
        iconSize={26}
        onPress={() => navigation.navigate('home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xxl,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
