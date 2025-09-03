import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultDividerStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colorBorder,
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

export default defaultDividerStyles;
