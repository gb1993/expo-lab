import {NavigatorScreenParams} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {CompositeNavigationProp} from '@react-navigation/native';

// 1. Adicionamos 'CreateLoan' aqui com os parâmetros necessários
type MainStackParamList = {
  dashboard: undefined;
  customers: undefined;
  loans: undefined;
  myAccount: undefined;
  // Definimos que CreateLoan pode receber um customerId
  CreateLoan: {customerId?: string};
};

type RootStackParamList = {
  home: undefined;
  main: NavigatorScreenParams<MainStackParamList>;
};

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type MainNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function useAppNavigation() {
  return useNavigation<
    CompositeNavigationProp<MainNavigationProp, RootNavigationProp>
  >();
}
