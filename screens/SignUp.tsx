import {useEffect, useState} from 'react';
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

/** Regras: 8+ caracteres, letras, números e pelo menos um caractere especial. */
function validatePassword(value: string): {valid: boolean; message: string} {
  if (value.length < 8) {
    return {valid: false, message: 'A senha deve ter 8 caracteres ou mais.'};
  }
  if (!/[a-zA-Z]/.test(value)) {
    return {valid: false, message: 'A senha deve conter pelo menos uma letra.'};
  }
  if (!/\d/.test(value)) {
    return {valid: false, message: 'A senha deve conter pelo menos um número.'};
  }
  if (!/[!@#$%^&*()_+\-=[\]{}|;':",.<>?/`~\\]/.test(value)) {
    return {
      valid: false,
      message:
        'A senha deve conter pelo menos um caractere especial (!@#$%^&* etc.).',
    };
  }
  return {valid: true, message: ''};
}

export default function SignUp() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, 'signUp'>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setInterval(
      () => setResendCountdown(s => (s <= 1 ? 0 : s - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [resendCountdown]);

  async function handleResend() {
    if (resendCountdown > 0 || resending || !email.trim()) return;
    setResending(true);
    setMessage(null);
    const {error} = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {emailRedirectTo: 'finapp://auth/callback'},
    });
    setResending(false);
    if (error) {
      setMessage({type: 'error', text: error.message});
      return;
    }
    setMessage({
      type: 'success',
      text: 'Email de confirmação reenviado. Verifique sua caixa de entrada.',
    });
    setResendCountdown(60);
  }

  async function handleSignUp() {
    if (!email.trim() || !password) {
      setMessage({type: 'error', text: 'Preencha email e senha.'});
      return;
    }
    if (password !== passwordConfirm) {
      setMessage({type: 'error', text: 'As senhas não coincidem.'});
      return;
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setMessage({type: 'error', text: passwordCheck.message});
      return;
    }
    setLoading(true);
    setMessage(null);
    const {data, error} = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: 'finapp://auth/callback',
        data: name.trim() ? {full_name: name.trim()} : undefined,
      },
    });
    setLoading(false);
    if (error) {
      setMessage({type: 'error', text: error.message});
      return;
    }
    if (data?.user && !data.session) {
      setEmailSent(true);
      setResendCountdown(60);
      setMessage({
        type: 'success',
        text: 'Enviamos um link de confirmação para seu email. Abra o link para ativar sua conta.',
      });
      return;
    }
    if (data?.session) {
      setMessage({type: 'success', text: 'Conta criada com sucesso.'});
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
          text="Criar conta"
          color={theme.colors.primary}
        />
        <CustomText
          fontSize="md"
          text="Preencha os dados abaixo"
          color={theme.colors.primary}
        />

        <View style={styles.form}>
          <CustomText
            fontSize="sm"
            weight="medium"
            text="Nome"
            color={theme.colors.primary}
          />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={'#999'}
            autoCapitalize="words"
            editable={!loading}
          />

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
            placeholderTextColor={'#999'}
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
          <CustomText
            fontSize="xs"
            text="8+ caracteres, letras, números e um caractere especial (!@#$%...)"
            color="#666"
            style={styles.hint}
          />
          <PasswordInput
            style={styles.inputWrapper}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            editable={!loading}
          />

          <CustomText
            fontSize="sm"
            weight="medium"
            text="Confirmar senha"
            color={theme.colors.primary}
          />
          <PasswordInput
            style={styles.inputWrapper}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="Repita a senha"
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

          {emailSent && (
            <Pressable
              onPress={handleResend}
              disabled={resendCountdown > 0 || resending}
              style={[
                styles.resendRow,
                resendCountdown > 0 && styles.resendDisabled,
              ]}>
              <CustomText
                fontSize="sm"
                text="Não recebi o email."
                color={theme.colors.primary}
              />
              <CustomText
                fontSize="sm"
                weight="medium"
                text={
                  resendCountdown > 0
                    ? `Reenviar em ${Math.floor(resendCountdown / 60)}:${String(resendCountdown % 60).padStart(2, '0')}`
                    : resending
                      ? 'Enviando...'
                      : 'Reenviar'
                }
                color={theme.colors.primary}
                style={styles.resendLink}
              />
            </Pressable>
          )}

          <CustomButton
            text="Criar conta"
            onPress={handleSignUp}
            disabled={loading}
          />

          <Pressable
            onPress={() => navigation.navigate('login')}
            style={styles.linkButton}
            disabled={loading}>
            <CustomText
              fontSize="md"
              text="Já tem conta? Entrar"
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
  hint: {
    marginBottom: theme.spacing.xs,
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
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
    gap: 4,
  },
  resendLink: {
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    opacity: 0.7,
  },
  linkButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
});
