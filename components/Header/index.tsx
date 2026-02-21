import {Image, StyleSheet, View} from 'react-native';
import {theme} from '../../themes';
import ResumeNavigation from '../ResumeNavigation';
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';
import {FontAwesome5} from '@expo/vector-icons';
import {useAppNavigation} from '../../hooks/useAppNavigation';

export default function Header() {
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Ellipse.png')}
        style={styles.ellipse}
      />
      <View style={styles.topContent}>
        <View>
          <CustomText fontSize="md" text={`Bem vindo,`} />
          <CustomText fontSize="lg" weight="bold" text={`Pobre`} />
        </View>
        <View>
          <CustomButton
            widthVariant={44}
            heightVariant={50}
            backgroundColor="transparent"
            iconName="user-alt"
            IconLibrary={FontAwesome5}
            iconSize={30}
            onPress={() => navigation.navigate('myAccount')}
          />
        </View>
      </View>
      <ResumeNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    height: 285,
  },
  ellipse: {
    position: 'absolute',
    top: -10,
    right: -10,
    pointerEvents: 'none',
  },
  topContent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
});
