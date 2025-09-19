export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;
  shadow: string;
  overlay: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeRadii {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeBreakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTransitions {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface ThemeZIndex {
  dropdown: number;
  sticky: number;
  fixed: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  typography: ThemeTypography;
  breakpoints: ThemeBreakpoints;
  transitions: ThemeTransitions;
  zIndex: ThemeZIndex;
  cssVars: Record<string, string>;
  isDark?: boolean;
}

export interface ThemeConfig {
  defaultTheme: string;
  themes: Record<string, Theme>;
  enableSystemTheme?: boolean;
  storageKey?: string;
}

export interface ThemeContextValue {
  currentTheme: Theme;
  themeName: string;
  availableThemes: Record<string, Theme>;
  setTheme: (themeName: string) => void;
  registerTheme: (theme: Theme) => void;
  unregisterTheme: (themeName: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

// CSS-in-JS 样式类型
export interface StyledProps {
  theme: Theme;
}

// 主题变量映射
export type ThemeVariables = {
  [K in keyof ThemeColors as `--lobe-agent-color-${K}`]: string;
} & {
  [K in keyof ThemeSpacing as `--lobe-agent-spacing-${K}`]: string;
} & {
  [K in keyof ThemeRadii as `--lobe-agent-radius-${K}`]: string;
};