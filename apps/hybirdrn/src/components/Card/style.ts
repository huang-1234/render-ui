import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultCardStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colorWhite,
    borderRadius: theme.borderRadiusBase,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: theme.colorBorder,
  },
  hoverable: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacingMedium,
  },
  title: {
    fontWeight: theme.fontWeightBold,
    fontSize: theme.fontSizeMedium,
    color: theme.colorText,
  },
  body: {
    padding: theme.spacingMedium,
  },
  footer: {
    padding: theme.spacingMedium,
  },
});

export default defaultCardStyles;
