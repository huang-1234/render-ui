import { Platform } from 'react-native';

// 根据平台动态导入组件
let Card: any;

if (Platform.OS === 'web') {
  // Web 平台
  Card = require('./index.web').default;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  Card = require('./index').default;
} else {
  // 小程序平台
  Card = require('./index.miniapp').default;
}

export default Card;
export type { CardProps } from './index';
