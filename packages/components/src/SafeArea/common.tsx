import { Platform } from 'react-native';

// 根据平台动态导入组件
let SafeArea: any;
let useSafeAreaInsets: any;

if (Platform.OS === 'web') {
  // Web 平台
  const WebSafeArea = require('./index.web');
  SafeArea = WebSafeArea.default;
  useSafeAreaInsets = WebSafeArea.useSafeAreaInsets;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  const RNSafeArea = require('./index');
  SafeArea = RNSafeArea.default;
  useSafeAreaInsets = RNSafeArea.useSafeAreaInsets;
} else {
  // 小程序平台
  const MiniappSafeArea = require('./index.miniapp');
  SafeArea = MiniappSafeArea.default;
  useSafeAreaInsets = MiniappSafeArea.useSafeAreaInsets;
}

export default SafeArea;
export { useSafeAreaInsets };
export type { SafeAreaProps, SafeAreaInsets } from './index';
