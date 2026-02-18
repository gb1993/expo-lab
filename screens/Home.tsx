import CustomButton from '../components/CustomButton';
import {CustomText} from '../components/CustomText';
import {useAppNavigation} from '../hooks/useAppNavigation';

export default function Home() {
  const navigation = useAppNavigation();
  return (
    <>
      <CustomText text="Home" />
      <CustomButton
        text="Detalhes"
        onPress={() => navigation.navigate('detail')}
        widthVariant={138}
      />
    </>
  );
}
