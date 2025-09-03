import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultSideBarStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colorWhite,
    width: 250,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: theme.colorBorder,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: theme.colorWhite,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    transform: [{ translateX: -250 }],
  },
  sidebarVisible: {
    transform: [{ translateX: 0 }],
  },
  header: {
    padding: theme.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
  },
  headerTitle: {
    fontSize: theme.fontSizeLarge,
    fontWeight: theme.fontWeightBold,
    color: theme.colorText,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
  },
  menuItemActive: {
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 4,
    borderLeftColor: theme.colorPrimary,
  },
  menuItemIcon: {
    marginRight: theme.spacingSmall,
    width: 24,
    textAlign: 'center',
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: theme.fontSizeBase,
    color: theme.colorText,
    flex: 1,
  },
  menuItemTextActive: {
    color: theme.colorPrimary,
    fontWeight: theme.fontWeightBold,
  },
  expandIcon: {
    width: 20,
    textAlign: 'center',
  },
  submenu: {
    backgroundColor: '#f9f9f9',
  },
  submenuItem: {
    paddingLeft: theme.spacingMedium * 2,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
  },
  submenuItemActive: {
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 4,
    borderLeftColor: theme.colorPrimary,
  },
  footer: {
    padding: theme.spacingMedium,
    borderTopWidth: 1,
    borderTopColor: theme.colorBorder,
  },
});

export default defaultSideBarStyles;
