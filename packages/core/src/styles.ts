import { Platform, getCurrentRuntime } from './runtime';

// 样式值类型
export type StyleValue = string | number;

// 样式对象类型
export type StyleObject = Record<string, StyleValue | Record<string, StyleValue>>;

// 平台特定样式
export type PlatformStyles<T extends StyleObject> = {
  [K in Platform]?: Partial<T>;
} & {
  default?: T;
};

// 主题变量接口
export interface ThemeVariables {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    text: string;
    textSecondary: string;
    background: string;
    surface: string;
    border: string;
    disabled: string;
    placeholder: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
    toast: number;
  };
}

// 默认主题
export const defaultTheme: ThemeVariables = {
  colors: {
    primary: '#1890ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#13c2c2',
    text: '#000000',
    textSecondary: '#666666',
    background: '#ffffff',
    surface: '#f5f5f5',
    border: '#d9d9d9',
    disabled: '#f5f5f5',
    placeholder: '#bfbfbf'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    round: 9999
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 600
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070
  }
};

// 暗色主题
export const darkTheme: ThemeVariables = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    text: '#ffffff',
    textSecondary: '#a6a6a6',
    background: '#000000',
    surface: '#1a1a1a',
    border: '#333333',
    disabled: '#2a2a2a',
    placeholder: '#666666'
  }
};

// 样式管理器类
export class StyleManager {
  private static instance: StyleManager;
  private theme: ThemeVariables = defaultTheme;
  private platform: Platform;
  private styleCache: Map<string, any> = new Map();

  private constructor() {
    this.platform = getCurrentRuntime().platform;
  }

  // 获取样式管理器单例
  static getInstance(): StyleManager {
    if (!StyleManager.instance) {
      StyleManager.instance = new StyleManager();
    }
    return StyleManager.instance;
  }

  // 设置主题
  setTheme(theme: Partial<ThemeVariables>): void {
    this.theme = this.mergeTheme(this.theme, theme);
    this.clearCache();
  }

  // 获取主题
  getTheme(): ThemeVariables {
    return this.theme;
  }

  // 合并主题
  private mergeTheme(base: ThemeVariables, override: Partial<ThemeVariables>): ThemeVariables {
    const merged = { ...base };

    Object.keys(override).forEach(key => {
      const value = override[key as keyof ThemeVariables];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        merged[key as keyof ThemeVariables] = {
          ...base[key as keyof ThemeVariables],
          ...value
        } as any;
      } else if (value !== undefined) {
        (merged as any)[key] = value;
      }
    });

    return merged;
  }

  // 创建样式
  create<T extends StyleObject>(
    styles: T | PlatformStyles<T>,
    componentName?: string
  ): T {
    const cacheKey = componentName || JSON.stringify(styles);

    if (this.styleCache.has(cacheKey)) {
      return this.styleCache.get(cacheKey);
    }

    let processedStyles: T;

    // 处理平台特定样式
    if (this.isPlatformStyles(styles)) {
      processedStyles = this.resolvePlatformStyles(styles);
    } else {
      processedStyles = styles as T;
    }

    // 适配样式
    const adaptedStyles = this.adaptStyles(processedStyles);

    // 缓存样式
    this.styleCache.set(cacheKey, adaptedStyles);

    return adaptedStyles;
  }

  // 判断是否为平台特定样式
  private isPlatformStyles<T extends StyleObject>(
    styles: T | PlatformStyles<T>
  ): styles is PlatformStyles<T> {
    const platformKeys: Platform[] = ['h5', 'rn', 'weapp', 'alipay', 'tt', 'qq', 'jd'];
    return platformKeys.some(key => key in styles) || 'default' in styles;
  }

  // 解析平台特定样式
  private resolvePlatformStyles<T extends StyleObject>(
    platformStyles: PlatformStyles<T>
  ): T {
    const defaultStyles = platformStyles.default || ({} as T);
    const platformSpecific = platformStyles[this.platform] || {};

    return {
      ...defaultStyles,
      ...platformSpecific
    };
  }

  // 适配样式
  private adaptStyles<T extends StyleObject>(styles: T): T {
    const adapted = { ...styles };

    Object.keys(adapted).forEach(key => {
      const value = adapted[key];

      if (typeof value === 'object' && value !== null) {
        adapted[key as keyof T] = this.adaptStyles(value as StyleObject) as any;
      } else {
        adapted[key as keyof T] = this.adaptStyleValue(key, value as StyleValue) as any;
      }
    });

    return this.platformSpecificAdaptation(adapted);
  }

  // 适配样式值
  private adaptStyleValue(property: string, value: StyleValue): StyleValue {
    // 单位转换
    if (typeof value === 'number') {
      return this.convertUnit(property, value);
    }

    // 字符串值处理
    if (typeof value === 'string') {
      // 主题变量替换
      if (value.startsWith('$')) {
        return this.resolveThemeVariable(value);
      }

      // 单位转换
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && value.endsWith('px')) {
        return this.convertUnit(property, numericValue);
      }
    }

    return value;
  }

  // 单位转换
  private convertUnit(property: string, value: number): StyleValue {
    switch (this.platform) {
      case 'rn':
        // React Native 使用数字
        return value;
      case 'h5':
        // H5 使用 px
        return `${value}px`;
      case 'weapp':
      case 'alipay':
      case 'tt':
        // 小程序使用 rpx 或 px
        if (this.shouldUseRpx(property)) {
          return `${value * 2}rpx`; // 假设设计稿是 750px
        }
        return `${value}px`;
      default:
        return value;
    }
  }

  // 判断是否应该使用 rpx
  private shouldUseRpx(property: string): boolean {
    const rpxProperties = [
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'top', 'right', 'bottom', 'left',
      'borderRadius', 'borderWidth',
      'fontSize', 'lineHeight'
    ];

    return rpxProperties.includes(property);
  }

  // 解析主题变量
  private resolveThemeVariable(variable: string): StyleValue {
    const path = variable.slice(1).split('.');
    let value: any = this.theme;

    for (const key of path) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`Theme variable not found: ${variable}`);
        return variable;
      }
    }

    return value;
  }

  // 平台特定适配
  private platformSpecificAdaptation<T extends StyleObject>(styles: T): T {
    switch (this.platform) {
      case 'rn':
        return this.adaptForRN(styles);
      case 'h5':
        return this.adaptForH5(styles);
      case 'weapp':
      case 'alipay':
      case 'tt':
        return this.adaptForMiniProgram(styles);
      default:
        return styles;
    }
  }

  // React Native 适配
  private adaptForRN<T extends StyleObject>(styles: T): T {
    const adapted = { ...styles };

    // 移除不支持的属性
    const unsupportedProps = ['boxShadow', 'cursor', 'userSelect'];
    unsupportedProps.forEach(prop => {
      delete adapted[prop];
    });

    // 转换阴影
    if ('boxShadow' in styles) {
      // 简化的阴影转换，实际项目中需要更复杂的解析
      Object.assign(adapted, {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2 // Android
      });
    }

    return adapted;
  }

  // H5 适配
  private adaptForH5<T extends StyleObject>(styles: T): T {
    const adapted = { ...styles };

    // 添加浏览器前缀
    if ('transform' in styles) {
      Object.assign(adapted, {
        WebkitTransform: styles.transform,
        MozTransform: styles.transform,
        msTransform: styles.transform
      });
    }

    return adapted;
  }

  // 小程序适配
  private adaptForMiniProgram<T extends StyleObject>(styles: T): T {
    const adapted = { ...styles };

    // 移除不支持的属性
    const unsupportedProps = ['cursor', 'userSelect', 'outline'];
    unsupportedProps.forEach(prop => {
      delete adapted[prop];
    });

    return adapted;
  }

  // 清除缓存
  private clearCache(): void {
    this.styleCache.clear();
  }

  // 获取响应式样式
  responsive<T extends StyleObject>(styles: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    xxl?: T;
  }): T {
    // 这里需要配合 useResponsive hook 使用
    // 简化实现，实际项目中需要根据屏幕尺寸动态选择
    return styles.md || styles.sm || styles.xs || ({} as T);
  }
}

// 导出样式管理器实例
export const styleManager = StyleManager.getInstance();

// 便捷方法
export const createStyles = styleManager.create.bind(styleManager);
export const setTheme = styleManager.setTheme.bind(styleManager);
export const getTheme = styleManager.getTheme.bind(styleManager);

// 样式工具函数
export const px = (value: number): string => `${value}px`;
export const rpx = (value: number): string => `${value}rpx`;
export const rem = (value: number): string => `${value}rem`;
export const em = (value: number): string => `${value}em`;
export const percent = (value: number): string => `${value}%`;
export const vh = (value: number): string => `${value}vh`;
export const vw = (value: number): string => `${value}vw`;

// 颜色工具函数
export const rgba = (r: number, g: number, b: number, a: number): string =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return rgba(r, g, b, alpha);
};

// 间距工具函数
export const spacing = (value: keyof ThemeVariables['spacing']): number => {
  return getTheme().spacing[value];
};

// 字体工具函数
export const fontSize = (value: keyof ThemeVariables['fontSize']): number => {
  return getTheme().fontSize[value];
};

// 圆角工具函数
export const borderRadius = (value: keyof ThemeVariables['borderRadius']): number => {
  return getTheme().borderRadius[value];
};