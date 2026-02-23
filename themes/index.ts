import {Dimensions} from 'react-native';

const themeSpacingLg = 24;
const themeWhiteSecondary = '#F5F5F5';
export const theme = {
  colors: {
    primary: '#100D40',
    purpleSecondary: '#0B0657',
    secondary: '#ffffff',
    page: themeWhiteSecondary,
    green: '#344E41',
    alert: '#c0a139',
    danger: '#c2404b',
    success: '#2dac73',
  },
  fonts: {
    light: 'RobotoCondensed_300Light',
    regular: 'RobotoCondensed_400Regular',
    medium: 'RobotoCondensed_500Medium',
    bold: 'RobotoCondensed_700Bold',
  },
  fontSize: {
    xs: 10,
    sm: 13,
    md: 16,
    lg: 20,
    xl: 32,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: themeSpacingLg,
    xl: 32,
    xxl: 64,
  },
  border: {
    default: themeWhiteSecondary,
  },
  borderRadius: {
    sm: 7,
    md: 10,
    lg: 15,
    xl: 20,
    full: 99,
  },
  boxShadow: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  width: {
    container: Dimensions.get('window').width - themeSpacingLg - themeSpacingLg,
  },
};
