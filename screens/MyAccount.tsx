import {Alert, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import {useAuthContext} from '../hooks/useAuthContext';
import {supabase} from '../lib/supabase';
import {theme} from '../themes';

export default function MyAccount() {
  const navigation = useNavigation<any>();
  const {session} = useAuthContext();
  const email = session?.user?.email ?? '';
  const name =
    session?.user?.user_metadata?.full_name ??
    session?.user?.user_metadata?.name ??
    'Usuário';

  async function handleSignOut() {
    const {error} = await supabase.auth.signOut();
    if (error) Alert.alert('Erro', error.message);
  }

  return (
    <View style={styles.container}>
      <CustomText
        fontSize="lg"
        weight="bold"
        text="Minha conta"
        color={theme.colors.primary}
      />
      <View style={styles.info}>
        <CustomText
          fontSize="sm"
          weight="medium"
          text="Nome"
          color={theme.colors.primary}
        />
        <CustomText fontSize="md" text={name} color={theme.colors.primary} />
        <CustomText
          fontSize="sm"
          weight="medium"
          text="Email"
          color={theme.colors.primary}
          style={styles.labelTop}
        />
        <CustomText fontSize="md" text={email} color={theme.colors.primary} />
      </View>
      <View style={styles.actions}>
        <CustomButton text="Ler Termos e Políticas" onPress={() => navigation.navigate('legal')} />
        <View style={{height: theme.spacing.md}} />
        <CustomButton text="Sair" onPress={handleSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.page,
  },
  info: {
    marginVertical: theme.spacing.lg,
  },
  labelTop: {
    marginTop: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
});
