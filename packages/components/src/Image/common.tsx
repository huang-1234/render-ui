import { Platform } from 'react-native';

// 根据平台动态导入组件
let Image: any;

if (Platform.OS === 'web') {
  // Web 平台
  Image = require('./index.web').default;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  Image = require('./index').default;
} else {
  // 小程序平台
  Image = require('./index.miniapp').default;
}

export default Image;
export type { ImageProps } from './index';
