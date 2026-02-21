import {StyleSheet} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme} from '../../themes';

interface ScreenContainerProps {
  children: React.ReactNode;
}

export default function ScreenContainer({children}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{...styles.container, paddingBottom: insets.bottom + 16}}
      edges={['bottom', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
});
