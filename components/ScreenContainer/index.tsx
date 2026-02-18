import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../../themes';

interface ScreenContainerProps {
  children: React.ReactNode;
}

export default function ScreenContainer({children}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
});
