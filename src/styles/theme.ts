import { FontWeight } from 'react-native';

export type ThemeFontWeight = "300" | "400" | "500" | "600" | "normal" | "bold" | "100" | "200" | "700" | "800" | "900" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "ultralight" | "thin" | "light" | "medium";

export const theme = {
  // 颜色
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
  colorBorder: '#d9d9d9',
  colorBgContainer: '#ffffff',

  // 字体
  fontSizeBase: 14,
  fontSizeSm: 12,
  fontSizeLg: 16,
  fontSizeXl: 20,

  // 间距
  paddingXS: 4,
  paddingSM: 8,
  paddingMD: 16,
  paddingLG: 24,
  paddingXL: 32,

  // 边框
  borderRadiusSM: 4,
  borderRadius: 6,
  borderRadiusLG: 8,

  // 阴影
  boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

  // 动画
  motionDurationFast: '0.1s',
  motionDurationMid: '0.2s',
  motionDurationSlow: '0.3s',

  // 字重
  fontWeightLight: "300" as ThemeFontWeight,
  fontWeightNormal: "400" as ThemeFontWeight,
  fontWeightMedium: "500" as ThemeFontWeight,
  fontWeightBold: "600" as ThemeFontWeight,
};

export type Theme = typeof theme;

export default theme;
