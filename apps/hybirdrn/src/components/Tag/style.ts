import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultTagStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadiusSmall,
  },
  default: {
    backgroundColor: theme.colorBackground,
    color: theme.colorText,
  },
  primary: {
    backgroundColor: '#e6f7ff',
    color: theme.colorPrimary,
  },
  success: {
    backgroundColor: '#f6ffed',
    color: theme.colorSuccess,
  },
  warning: {
    backgroundColor: '#fffbe6',
    color: theme.colorWarning,
  },
  danger: {
    backgroundColor: '#fff1f0',
    color: theme.colorError,
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: theme.fontSizeXs,
  },
  medium: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: theme.fontSizeSmall,
  },
  large: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: theme.fontSizeBase,
  },
  text: {
    fontSize: theme.fontSizeSmall,
  },
  closeIcon: {
    marginLeft: 4,
    fontSize: theme.fontSizeXs,
  },
});

export default defaultTagStyles;
