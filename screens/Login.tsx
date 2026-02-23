import {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import PasswordInput from '../components/PasswordInput';
import {theme} from '../themes';
import {supabase} from '../lib/supabase';

type AuthStackParamList = {
  login: undefined;
  signUp: undefined;
};

export default function Login() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, 'login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setMessage({type: 'error', text: 'Preencha email e senha.'});
      return;
    }
    setLoading(true);
    setMessage(null);
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setMessage({type: 'error', text: error.message});
      return;
    }
    if (data?.session) {
      setMessage({type: 'success', text: 'Entrando...'});
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <CustomText
          fontSize="xl"
          weight="bold"
          text="Finapp"
          color={theme.colors.primary}
        />
        <CustomText
          fontSize="md"
          text="Entre na sua conta"
          color={theme.colors.primary}
        />

        <View style={styles.form}>
          <CustomText
            fontSize="sm"
            weight="medium"
            text="Email"
            color={theme.colors.primary}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!loading}
          />

          <CustomText
            fontSize="sm"
            weight="medium"
            text="Senha"
            color={theme.colors.primary}
          />
          <PasswordInput
            style={styles.inputWrapper}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#999"
            editable={!loading}
          />

          {message && (
            <View
              style={[
                styles.messageBox,
                message.type === 'error'
                  ? styles.messageError
                  : styles.messageSuccess,
              ]}>
              <CustomText
                fontSize="sm"
                text={message.text}
                color={
                  message.type === 'error' ? '#b91c1c' : theme.colors.green
                }
              />
            </View>
          )}

          <CustomButton
            text="Entrar"
            onPress={handleSignIn}
            disabled={loading}
          />
          <Pressable
            onPress={() => navigation.navigate('signUp')}
            style={styles.linkButton}
            disabled={loading}>
            <CustomText
              fontSize="md"
              text="Não tem conta? Criar conta"
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
  },
  form: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {},
  messageBox: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  messageError: {
    backgroundColor: '#fef2f2',
  },
  messageSuccess: {
    backgroundColor: '#f0fdf4',
  },
  linkButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
});
