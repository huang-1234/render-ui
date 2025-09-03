import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultGridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    padding: theme.spacingSmall / 2,
  },
});

export default defaultGridStyles;
