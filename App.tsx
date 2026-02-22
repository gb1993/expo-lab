import {useCallback} from 'react';
import {View} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AppRoutes from './routes';
import AuthProvider from './providers/AuthProvider';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = Font.useFonts({
    RobotoCondensed_300Light: require('./themes/fonts/Roboto_Condensed-Light.ttf'),
    RobotoCondensed_400Regular: require('./themes/fonts/Roboto_Condensed-Regular.ttf'),
    RobotoCondensed_500Medium: require('./themes/fonts/Roboto_Condensed-Medium.ttf'),
    RobotoCondensed_700Bold: require('./themes/fonts/Roboto_Condensed-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </View>
  );
}
