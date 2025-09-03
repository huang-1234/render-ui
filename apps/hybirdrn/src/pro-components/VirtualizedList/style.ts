import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultVirtualListStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    position: 'relative'
  },
  item: {
    overflow: 'hidden'
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacingLarge
  },
  emptyText: {
    fontSize: theme.fontSizeMedium,
    color: theme.colorTextSecondary,
    textAlign: 'center'
  }
});

export default defaultVirtualListStyles;
