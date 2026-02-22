// routes.ts
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import DashBoard from './screens/DashBoard';
import Customers from './screens/Customers';
import Loans from './screens/Loans';
import MyAccount from './screens/MyAccount';

import ScreenContainer from './components/ScreenContainer';
import DefaultNavigation from './components/DefaultNavigation';
import { useAuthContext } from './hooks/useAuthContext';
import { theme } from './themes';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        screenLayout={({ children }) => (
          <ScreenContainer>{children}</ScreenContainer>
        )}
      >
        <Stack.Screen name="dashboard" component={DashBoard} />
        <Stack.Screen name="customers" component={Customers} />
        <Stack.Screen name="loans" component={Loans} />
        <Stack.Screen name="myAccount" component={MyAccount} />
      </Stack.Navigator>
      <DefaultNavigation />
    </>
  );
}

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      screenLayout={({ children }) => (
        <ScreenContainer>{children}</ScreenContainer>
      )}
    >
      <Stack.Screen
        name="home"
        component={Home}
        options={{ contentStyle: { backgroundColor: 'transparent' } }}
      />
      <Stack.Screen name="main" component={MainStack} />
    </Stack.Navigator>
  );
}

function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="signUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  const { isLoggedIn, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.page }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {isLoggedIn ? <RootStack /> : <LoginStack />}
      </SafeAreaView>
    </NavigationContainer>
  );
}
