import { Platform } from 'react-native';

// 在 Web 平台上，某些动画属性不支持 native driver
export const useNativeDriver = Platform.OS !== 'web';