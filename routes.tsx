// routes.ts
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import Home from './screens/Home';
import DashBoard from './screens/DashBoard';
import Customers from './screens/Customers';
import Loans from './screens/Loans';
import MyAccount from './screens/MyAccount';

import ScreenContainer from './components/ScreenContainer';
import DefaultNavigation from './components/DefaultNavigation';

const Stack = createNativeStackNavigator();

// 🔹 Stack que terá a navegação inferior
function MainStack() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        screenLayout={({children}) => (
          <ScreenContainer>{children}</ScreenContainer>
        )}>
        <Stack.Screen name="dashboard" component={DashBoard} />
        <Stack.Screen name="customers" component={Customers} />
        <Stack.Screen name="loans" component={Loans} />
        <Stack.Screen name="myAccount" component={MyAccount} />
      </Stack.Navigator>

      {/* Navegação flutuante */}
      <DefaultNavigation />
    </>
  );
}

// Stack raiz
function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
      screenLayout={({children}) => (
        <ScreenContainer>{children}</ScreenContainer>
      )}>
      {/* Home separada */}
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          contentStyle: {backgroundColor: 'transparent'},
        }}
      />

      {/* Área com navegação inferior */}
      <Stack.Screen name="main" component={MainStack} />
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
