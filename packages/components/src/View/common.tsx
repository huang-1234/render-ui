import { Platform } from 'react-native';

// 根据平台动态导入组件
let View: any;

if (Platform.OS === 'web') {
  // Web 平台
  View = require('./index.web').default;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  View = require('./index').default;
} else {
  // 小程序平台
  View = require('./index.miniapp').default;
}

export default View;
export type { ViewProps } from './index';
