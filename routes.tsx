import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from './components/Header';
import Home from './screens/Home';
import {Detail} from './screens/Detail';
import ScreenContainer from './components/ScreenContainer';

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
      <Stack.Screen name="detail" component={Detail} />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
        <Header />
        <RootStack />
      </SafeAreaView>
    </NavigationContainer>
  );
}
