import { Platform } from 'react-native';
import { IconMap, IconName } from './iconMap';

// 根据平台动态导入组件
let Icon: any;

if (Platform.OS === 'web') {
  // Web 平台
  Icon = require('./index.web').default;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  Icon = require('./index').default;
} else {
  // 小程序平台
  Icon = require('./index.miniapp').default;
}

export default Icon;
export type { IconProps } from './index';
export { IconName, IconMap };
