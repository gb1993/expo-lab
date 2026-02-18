import {AntDesign} from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import {CustomText} from '../components/CustomText';
import {useAppNavigation} from '../hooks/useAppNavigation';

export function Detail() {
  const navigation = useAppNavigation();
  return (
    <>
      <CustomText text="Detalhes" />
      <CustomButton
        text="Ir para Home"
        onPress={() => navigation.navigate('home')}
        iconName="arrow-right"
        IconLibrary={AntDesign}
        iconPosition="right"
      />
    </>
  );
}
