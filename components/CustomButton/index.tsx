import {Pressable, PressableProps, StyleSheet} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import CustomText from '../CustomText';
import {theme} from '../../themes';

interface CustomButtonProps<
  LibraryComponent extends React.ComponentType<any>,
> extends PressableProps {
  text?: string;
  icon?: React.ReactNode;
  iconName?: React.ComponentProps<LibraryComponent>['name'];
  iconSize?: number;
  iconColor?: string;
  iconPosition?: 'left' | 'right';
  IconLibrary?: LibraryComponent;
  widthVariant?: number | 'fluid';
  heightVariant?: number;
  backgroundColor?: string;
}

export default function CustomButton<
  LibraryComponent extends React.ComponentType<any> = typeof MaterialIcons,
>({
  text,
  icon,
  iconName,
  iconSize = 18,
  iconColor = theme.colors.secondary,
  iconPosition = 'left',
  IconLibrary = MaterialIcons as unknown as LibraryComponent,
  widthVariant = 'fluid',
  heightVariant = 44,
  backgroundColor = theme.colors.purpleSecondary,
  ...props
}: CustomButtonProps<LibraryComponent>) {
  const IconLib = IconLibrary as any;
  const IconComponent = icon ? null : iconName ? (
    <IconLib name={iconName} size={iconSize} color={iconColor} />
  ) : null;

  const finalIcon = icon || IconComponent;

  return (
    <Pressable
      style={[
        styles.button,
        widthVariant === 'fluid' ? {width: '100%'} : {width: widthVariant},
        {height: heightVariant},
        {backgroundColor: backgroundColor},
      ]}
      {...props}>
      {finalIcon && iconPosition === 'left' && finalIcon}
      {text && (
        <CustomText
          weight="bold"
          text={text}
          style={{color: theme.colors.secondary}}
        />
      )}
      {finalIcon && iconPosition === 'right' && finalIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    boxShadow: theme.boxShadow.lg,
  },
});
