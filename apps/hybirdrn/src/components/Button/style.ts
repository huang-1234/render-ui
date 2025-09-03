import { StyleSheet, Platform } from 'react-native';
import theme from '../../styles/theme';

export const defaultButtonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacingSmall,
    paddingHorizontal: theme.spacingMedium,
    borderRadius: theme.borderRadiusBase,
    backgroundColor: theme.colorPrimary,
    minHeight: 40,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
        borderWidth: 0,
      },
      default: {},
    }),
  },
  text: {
    color: theme.colorWhite,
    fontSize: theme.fontSizeBase,
    fontWeight: theme.fontWeightMedium,
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: theme.colorTextDisabled,
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
      default: {},
    }),
  },
  loading: {
    opacity: 0.8,
  },
  small: {
    paddingVertical: theme.spacingXs,
    paddingHorizontal: theme.spacingSmall,
    minHeight: 32,
  },
  large: {
    paddingVertical: theme.spacingMedium,
    paddingHorizontal: theme.spacingLarge,
    minHeight: 48,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colorPrimary,
  },
  outlineText: {
    color: theme.colorPrimary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  ghostText: {
    color: theme.colorPrimary,
  },
  secondary: {
    backgroundColor: theme.colorTextSecondary,
  },
  success: {
    backgroundColor: theme.colorSuccess,
  },
  warning: {
    backgroundColor: theme.colorWarning,
  },
  error: {
    backgroundColor: theme.colorError,
  },
  iconLeft: {
    marginRight: theme.spacingSmall,
  },
  iconRight: {
    marginLeft: theme.spacingSmall,
  },
  block: {
    width: '100%',
  },
  rounded: {
    borderRadius: 9999,
  },
});
