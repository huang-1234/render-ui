import { Platform } from 'react-native';

// 根据平台动态导入组件
let Text: any;
let Heading1: any;
let Heading2: any;
let Heading3: any;
let Heading4: any;
let Paragraph: any;
let Caption: any;
let Link: any;

if (Platform.OS === 'web') {
  // Web 平台
  const WebText = require('./index.web');
  Text = WebText.default;
  Heading1 = WebText.Heading1;
  Heading2 = WebText.Heading2;
  Heading3 = WebText.Heading3;
  Heading4 = WebText.Heading4;
  Paragraph = WebText.Paragraph;
  Caption = WebText.Caption;
  Link = WebText.Link;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  const RNText = require('./index');
  Text = RNText.default;
  Heading1 = RNText.Heading1;
  Heading2 = RNText.Heading2;
  Heading3 = RNText.Heading3;
  Heading4 = RNText.Heading4;
  Paragraph = RNText.Paragraph;
  Caption = RNText.Caption;
  Link = RNText.Link;
} else {
  // 小程序平台
  const MiniappText = require('./index.miniapp');
  Text = MiniappText.default;
  Heading1 = MiniappText.Heading1;
  Heading2 = MiniappText.Heading2;
  Heading3 = MiniappText.Heading3;
  Heading4 = MiniappText.Heading4;
  Paragraph = MiniappText.Paragraph;
  Caption = MiniappText.Caption;
  Link = MiniappText.Link;
}

export default Text;
export { Heading1, Heading2, Heading3, Heading4, Paragraph, Caption, Link };
export type { TextProps } from './index';
