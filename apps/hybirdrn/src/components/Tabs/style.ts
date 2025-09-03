import { StyleSheet, Platform } from 'react-native';
import theme from '../../styles/theme';

export const defaultTabsStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
    backgroundColor: theme.colorWhite,
  },
  tab: {
    paddingHorizontal: theme.spacingMedium,
    paddingVertical: theme.spacingSmall,
    color: theme.colorTextSecondary,
    fontSize: theme.fontSizeBase,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center',
      },
      default: {},
    }),
  },
  activeTab: {
    color: theme.colorPrimary,
    fontWeight: theme.fontWeightMedium,
    borderBottomWidth: 2,
    borderBottomColor: theme.colorPrimary,
  },
  content: {
    flex: 1,
    padding: theme.spacingMedium,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colorBorder,
    borderRadius: theme.borderRadiusBase,
    overflow: 'hidden',
  },
  cardTabBar: {
    backgroundColor: theme.colorBackground,
    borderBottomWidth: 0,
  },
  cardTab: {
    backgroundColor: theme.colorBackground,
    borderTopLeftRadius: theme.borderRadiusBase,
    borderTopRightRadius: theme.borderRadiusBase,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'transparent',
    marginRight: 2,
  },
  cardActiveTab: {
    backgroundColor: theme.colorWhite,
    borderColor: theme.colorBorder,
    borderBottomColor: theme.colorWhite,
    marginBottom: -1,
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: theme.colorBorder,
    backgroundColor: theme.colorWhite,
  },
  disabled: {
    opacity: 0.5,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
      default: {},
    }),
  },
});
