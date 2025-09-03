import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultTypographyStyles = StyleSheet.create({
  container: {
    color: theme.colorText,
    fontSize: theme.fontSizeBase,
  },
  primary: {
    color: theme.colorText,
  },
  secondary: {
    color: theme.colorTextSecondary,
  },
  success: {
    color: theme.colorSuccess,
  },
  warning: {
    color: theme.colorWarning,
  },
  danger: {
    color: theme.colorError,
  },
  xs: {
    fontSize: theme.fontSizeXs,
  },
  sm: {
    fontSize: theme.fontSizeSmall,
  },
  md: {
    fontSize: theme.fontSizeBase,
  },
  lg: {
    fontSize: theme.fontSizeLarge,
  },
  xl: {
    fontSize: theme.fontSizeXl,
  },
  bold: {
    fontWeight: theme.fontWeightBold,
  },
  center: {
    textAlign: 'center',
  },
});

export default defaultTypographyStyles;
