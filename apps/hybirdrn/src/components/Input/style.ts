import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultInputStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colorBorder,
    borderRadius: theme.borderRadiusBase,
    backgroundColor: theme.colorWhite,
    paddingHorizontal: theme.spacingMedium,
    height: 40,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: theme.colorText,
    fontSize: theme.fontSizeBase,
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        borderWidth: 0,
      },
      default: {},
    }),
  },
  disabled: {
    backgroundColor: theme.colorBackground,
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
      default: {},
    }),
  },
  error: {
    borderColor: theme.colorError,
  },
  focus: {
    borderColor: theme.colorPrimary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colorPrimary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: `0 0 0 2px ${theme.colorPrimaryLight}`,
      },
    }),
  },
  prefix: {
    marginRight: theme.spacingSmall,
  },
  suffix: {
    marginLeft: theme.spacingSmall,
  },
  clearButton: {
    padding: theme.spacingXs,
  },
  clearIcon: {
    color: theme.colorTextSecondary,
    fontSize: 16,
  },
  errorText: {
    color: theme.colorError,
    fontSize: theme.fontSizeSmall,
    marginTop: theme.spacingXs,
  },
  small: {
    height: 32,
  },
  large: {
    height: 48,
  },
  rounded: {
    borderRadius: 20,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacingSmall,
    paddingBottom: theme.spacingSmall,
  },
});

export default defaultInputStyles;
