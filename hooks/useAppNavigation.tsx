import {useNavigation, NavigationProp} from '@react-navigation/native';

type RootStackParamList = {
  home: undefined;
  dashboard: undefined;
  customers: undefined;
  loans: undefined;
  myAccount: undefined;
};

export function useAppNavigation() {
  return useNavigation<NavigationProp<RootStackParamList>>();
}
