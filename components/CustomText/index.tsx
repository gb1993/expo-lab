import {Text, TextProps} from 'react-native';
import {theme} from '../../themes';

interface CustomTextProps extends TextProps {
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  fontSize?: keyof typeof theme.fontSize;
  color?: string;
  text?: string;
}

export default function CustomText({
  text,
  weight = 'regular',
  fontSize = 'md',
  color = theme.colors.purpleSecondary,
  style,
  ...rest
}: CustomTextProps) {
  return (
    <Text
      style={[
        {
          fontFamily: theme.fonts[weight],
          fontSize: theme.fontSize[fontSize],
          color,
        },
        style,
      ]}
      {...rest}>
      {text}
    </Text>
  );
}
