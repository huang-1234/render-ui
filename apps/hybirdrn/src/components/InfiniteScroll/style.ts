import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultInfiniteScrollStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
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
  endMessage: {
    padding: theme.spacingMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endMessageText: {
    color: theme.colorTextSecondary,
    fontSize: theme.fontSizeSmall,
  },
  errorContainer: {
    padding: theme.spacingMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: theme.colorError,
    fontSize: theme.fontSizeSmall,
  },
  retryButton: {
    marginTop: theme.spacingSmall,
    paddingVertical: theme.spacingXs,
    paddingHorizontal: theme.spacingSmall,
    backgroundColor: theme.colorPrimary,
    borderRadius: theme.borderRadiusSmall,
  },
  retryButtonText: {
    color: theme.colorWhite,
    fontSize: theme.fontSizeSmall,
  },
});

export default defaultInfiniteScrollStyles;
