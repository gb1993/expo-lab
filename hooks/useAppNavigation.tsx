import {useNavigation, NavigationProp} from '@react-navigation/native';

type RootStackParamList = {
  home: undefined;
  detail: undefined;
};

export function useAppNavigation() {
  return useNavigation<NavigationProp<RootStackParamList>>();
}
