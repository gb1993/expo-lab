import {Text, TextProps} from 'react-native';
import {theme} from '../../themes';

interface CustomTextProps extends TextProps {
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  fontSize?: keyof typeof theme.fontSize;
  color?: string;
  text: string;
}

export function CustomText({
  text,
  weight = 'regular',
  fontSize = 'md',
  color = theme.colors.secondary,
}: CustomTextProps) {
  return (
    <Text
      style={[
        {
          fontFamily: theme.fonts[weight],
          fontSize: theme.fontSize[fontSize],
          color,
        },
      ]}>
      {text}
    </Text>
  );
}
