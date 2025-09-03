import { Platform } from 'react-native';

export const usePlatform = () => {
  return {
    isWeb: Platform.OS === 'web',
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    OS: Platform.OS,
  };
};

export default usePlatform;
