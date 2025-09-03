import { StyleSheet, Platform } from 'react-native';
import theme from '../../styles/theme';

export const defaultBoxStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    ...Platform.select({
      web: {
        boxSizing: 'border-box',
      },
      default: {},
    }),
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  padding: {
    padding: theme.spacingMedium,
  },
  margin: {
    margin: theme.spacingMedium,
  },
  border: {
    borderWidth: 1,
    borderColor: theme.colorBorder,
    borderRadius: theme.borderRadiusBase,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: theme.shadowBase,
      },
    }),
  },
});
