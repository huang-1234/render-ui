import { Platform } from 'react-native';

// 根据平台动态导入组件
let Input: any;

if (Platform.OS === 'web') {
  // Web 平台
  Input = require('./index.web').default;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  Input = require('./index').default;
} else {
  // 小程序平台
  Input = require('./index.miniapp').default;
}

export default Input;
export type { InputProps } from './index';
