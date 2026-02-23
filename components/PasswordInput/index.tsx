import {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {theme} from '../../themes';

type PasswordInputProps = TextInputProps & {
  inputStyle?: object;
};

export default function PasswordInput({
  inputStyle,
  style,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        {...props}
        style={[styles.input, inputStyle]}
        secureTextEntry={!visible}
        placeholderTextColor={props.placeholderTextColor ?? '#999'}
      />
      <Pressable
        onPress={() => setVisible(v => !v)}
        style={styles.iconButton}
        hitSlop={12}>
        <MaterialIcons
          name={visible ? 'visibility-off' : 'visibility'}
          size={24}
          color={theme.colors.primary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingRight: 48,
    fontSize: 16,
    color: theme.colors.primary,
  },
  iconButton: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
