// "300" | "400" | "500" | "600" | "normal" | "bold" | "100" | "200" | "700" | "800" | "900" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "ultralight" | "thin" | "light" | "medium" |
export type FontWeight = "300" | "400" | "500" | "600" | "normal" | "bold" | "100" | "200" | "700" | "800" | "900" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "ultralight" | "thin" | "light" | "medium"
export const theme = {
  // 颜色
  colorPrimary: '#1890ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#f5222d',
  colorText: '#333333',
  colorTextSecondary: '#666666',
  colorTextDisabled: '#999999',
  colorBorder: '#e8e8e8',
  colorBackground: '#f5f5f5',
  colorWhite: '#ffffff',
  colorPrimaryLight: '#e6f7ff',
  colorSuccessLight: '#f0f9eb',
  colorWarningLight: '#fffbe6',
  colorErrorLight: '#fff1f0',
  colorTextLight: '#f5f5f5',
  colorTextSecondaryLight: '#f0f0f0',
  colorTextDisabledLight: '#f5f5f5',
  colorBorderLight: '#e8e8e8',
  colorBackgroundLight: '#f5f5f5',
  colorWhiteLight: '#ffffff',
  colorPrimaryDark: '#0958d9',
  colorSuccessDark: '#389e0d',
  colorWarningDark: '#d48806',
  colorErrorDark: '#cf1322',
  colorTextDark: '#333333',
  colorTextSecondaryDark: '#666666',
  colorTextDisabledDark: '#999999',
  colorBorderDark: '#e8e8e8',
  colorBackgroundDark: '#f5f5f5',
  colorWhiteDark: '#ffffff',

  // 间距
  spacingXxs: 2,
  spacingXs: 4,
  spacingSmall: 8,
  spacingMedium: 16,
  spacingLarge: 24,
  spacingXl: 32,
  spacingXxl: 48,

  // 字体大小
  fontSizeXs: 10,
  fontSizeSmall: 12,
  fontSizeBase: 14,
  fontSizeMedium: 16,
  fontSizeLarge: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,

  // 圆角
  borderRadiusXs: 2,
  borderRadiusSmall: 4,
  borderRadiusBase: 6,
  borderRadiusLarge: 8,
  borderRadiusCircle: '50%',

  // 动画
  animationDurationFast: '0.2s',
  animationDurationBase: '0.3s',
  animationDurationSlow: '0.4s',

  // 阴影
  shadowBase: '0 2px 8px rgba(0, 0, 0, 0.15)',

  // 字重
  fontWeightLight: "300" as FontWeight,
  fontWeightNormal: "400" as FontWeight ,
  fontWeightMedium: "500" as FontWeight,
  fontWeightBold: "600" as FontWeight,
};

export type Theme = typeof theme;

export default theme;
