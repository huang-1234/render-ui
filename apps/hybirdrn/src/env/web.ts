import { Platform } from 'react-native';

let isWeb = true;
if (Platform.OS === 'web') {
  isWeb = true;
} else {
  isWeb = false;
}
export { isWeb };
