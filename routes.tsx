import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Home from './screens/Home';
import ScreenContainer from './components/ScreenContainer';
import DashBoard from './screens/DashBoard';
import Customers from './screens/Customers';
import Loans from './screens/Loans';
import MyAccount from './screens/MyAccount';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
      screenLayout={({children}) => <ScreenContainer children={children} />}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="dashboard" component={DashBoard} />
      <Stack.Screen name="customers" component={Customers} />
      <Stack.Screen name="loans" component={Loans} />
      <Stack.Screen name="myAccount" component={MyAccount} />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
        <RootStack />
      </SafeAreaView>
    </NavigationContainer>
  );
}
