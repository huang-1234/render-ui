import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

export const defaultModalStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    backgroundColor: theme.colorWhite,
    borderRadius: theme.borderRadiusBase,
    overflow: 'hidden',
    padding: 0,
    minWidth: 280,
    maxWidth: width * 0.8,
    maxHeight: height * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  // 居中模式
  centered: {
    top: '50%',
    left: '50%',
    transform: [{ translateX: -140 }, { translateY: -100 }],
  },
  // 从顶部弹出
  top: {
    top: 0,
    left: '50%',
    transform: [{ translateX: -140 }],
  },
  // 从底部弹出
  bottom: {
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -140 }],
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  // 全屏模式
  fullscreen: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
  },
  title: {
    fontSize: theme.fontSizeLarge,
    fontWeight: theme.fontWeightBold,
    color: theme.colorText,
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: theme.spacingSmall,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {},
    }),
  },
  closeIcon: {
    fontSize: 20,
    color: theme.colorTextSecondary,
    fontWeight: theme.fontWeightBold,
  },
  body: {
    padding: theme.spacingMedium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: theme.spacingMedium,
    borderTopWidth: 1,
    borderTopColor: theme.colorBorder,
  },
  button: {
    marginLeft: theme.spacingSmall,
  },
});

export default defaultModalStyles;
