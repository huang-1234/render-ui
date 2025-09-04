import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultPullRefreshStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  refreshContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    transform: [{ translateY: -60 }],
  },
  refreshContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    marginLeft: theme.spacingSmall,
    color: theme.colorTextSecondary,
    fontSize: theme.fontSizeSmall,
  },
  arrowIcon: {
    fontSize: 16,
    color: theme.colorTextSecondary,
    transform: [{ rotate: '0deg' }],
  },
  arrowIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  loadingContainer: {
    padding: theme.spacingMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacingSmall,
    color: theme.colorTextSecondary,
    fontSize: theme.fontSizeSmall,
  },
});

export default defaultPullRefreshStyles;
