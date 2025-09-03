import { StyleSheet, Platform } from 'react-native';
import theme from '../../styles/theme';

export const defaultTextStyles = StyleSheet.create({
  text: {
    fontSize: theme.fontSizeBase,
    color: theme.colorText,
    ...Platform.select({
      web: {
        cursor: 'default',
        userSelect: 'none',
      },
      default: {},
    }),
  },
  h1: {
    fontSize: 28,
    fontWeight: theme.fontWeightBold,
    marginBottom: theme.spacingMedium,
  },
  h2: {
    fontSize: 24,
    fontWeight: theme.fontWeightBold,
    marginBottom: theme.spacingMedium,
  },
  h3: {
    fontSize: 20,
    fontWeight: theme.fontWeightBold,
    marginBottom: theme.spacingSmall,
  },
  h4: {
    fontSize: 16,
    fontWeight: theme.fontWeightMedium,
    marginBottom: theme.spacingSmall,
  },
  paragraph: {
    marginBottom: theme.spacingMedium,
    lineHeight: 22,
  },
  bold: {
    fontWeight: theme.fontWeightBold,
  },
  italic: {
    fontStyle: 'italic',
  },
  center: {
    textAlign: 'center',
  },
  small: {
    fontSize: theme.fontSizeSmall,
  },
  large: {
    fontSize: theme.fontSizeLarge,
  },
  primary: {
    color: theme.colorPrimary,
  },
  secondary: {
    color: theme.colorTextSecondary,
  },
  error: {
    color: theme.colorError,
  },
  success: {
    color: theme.colorSuccess,
  },
  warning: {
    color: theme.colorWarning,
  },
});
