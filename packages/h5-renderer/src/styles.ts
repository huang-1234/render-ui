export default class H5StyleManager {
  private static instance: H5StyleManager;
  private styleSheets: Map<string, CSSStyleSheet> = new Map();
  private cssRules: Map<string, string> = new Map();

  static getInstance(): H5StyleManager {
    if (!H5StyleManager.instance) {
      H5StyleManager.instance = new H5StyleManager();
    }
    return H5StyleManager.instance;
  }

  // 创建样式
  create<T extends Record<string, any>>(styles: T, componentName: string): T {
    const adaptedStyles = this.adaptStyles(styles);
    this.generateCSS(adaptedStyles, componentName);
    return adaptedStyles as T;
  }

  // 适配样式到 H5
  private adaptStyles(styles: Record<string, any>): Record<string, any> {
    const adaptedStyles: Record<string, any> = {};

    Object.entries(styles).forEach(([key, style]) => {
      adaptedStyles[key] = this.adaptSingleStyle(style);
    });

    return adaptedStyles;
  }

  // 适配单个样式对象
  private adaptSingleStyle(style: Record<string, any>): Record<string, any> {
    const adaptedStyle: Record<string, any> = {};

    Object.entries(style).forEach(([property, value]) => {
      const adaptedProperty = this.adaptProperty(property);
      const adaptedValue = this.adaptValue(property, value);
      
      if (adaptedProperty && adaptedValue !== undefined) {
        adaptedStyle[adaptedProperty] = adaptedValue;
      }
    });

    return adaptedStyle;
  }

  // 适配属性名
  private adaptProperty(property: string): string {
    const propertyMap: Record<string, string> = {
      // React Native 到 CSS 属性映射
      'marginHorizontal': 'margin-left, margin-right',
      'marginVertical': 'margin-top, margin-bottom',
      'paddingHorizontal': 'padding-left, padding-right',
      'paddingVertical': 'padding-top, padding-bottom',
      'borderTopLeftRadius': 'border-top-left-radius',
      'borderTopRightRadius': 'border-top-right-radius',
      'borderBottomLeftRadius': 'border-bottom-left-radius',
      'borderBottomRightRadius': 'border-bottom-right-radius',
      'shadowColor': 'box-shadow-color',
      'shadowOffset': 'box-shadow-offset',
      'shadowOpacity': 'box-shadow-opacity',
      'shadowRadius': 'box-shadow-blur',
      'elevation': 'box-shadow'
    };

    return propertyMap[property] || this.camelToKebab(property);
  }

  // 适配属性值
  private adaptValue(property: string, value: any): any {
    if (value === null || value === undefined) {
      return undefined;
    }

    // 处理数字值，添加 px 单位
    if (typeof value === 'number') {
      const noUnitProperties = [
        'opacity', 'zIndex', 'flex', 'flexGrow', 'flexShrink', 
        'order', 'fontWeight', 'lineHeight', 'aspectRatio'
      ];
      
      if (noUnitProperties.includes(property)) {
        return value;
      }
      
      return `${value}px`;
    }

    // 处理特殊属性
    switch (property) {
      case 'marginHorizontal':
      case 'paddingHorizontal':
        return typeof value === 'number' ? `${value}px` : value;
      
      case 'marginVertical':
      case 'paddingVertical':
        return typeof value === 'number' ? `${value}px` : value;
      
      case 'shadowColor':
      case 'shadowOffset':
      case 'shadowOpacity':
      case 'shadowRadius':
        return this.adaptShadow(property, value);
      
      case 'elevation':
        return this.adaptElevation(value);
      
      case 'transform':
        return this.adaptTransform(value);
      
      default:
        return value;
    }
  }

  // 适配阴影
  private adaptShadow(property: string, value: any): string {
    // 这里需要收集所有阴影相关属性，然后生成完整的 box-shadow
    // 简化实现，实际应该更复杂
    if (property === 'elevation') {
      return `0 ${value}px ${value * 2}px rgba(0, 0, 0, 0.1)`;
    }
    return value;
  }

  // 适配 elevation 到 box-shadow
  private adaptElevation(elevation: number): string {
    if (elevation === 0) return 'none';
    
    const blur = elevation * 2;
    const opacity = Math.min(0.24, elevation * 0.04);
    
    return `0 ${elevation}px ${blur}px rgba(0, 0, 0, ${opacity})`;
  }

  // 适配 transform
  private adaptTransform(transforms: any[]): string {
    if (!Array.isArray(transforms)) return '';
    
    return transforms.map(transform => {
      const [key, value] = Object.entries(transform)[0];
      
      switch (key) {
        case 'translateX':
        case 'translateY':
          return `${key}(${typeof value === 'number' ? `${value}px` : value})`;
        case 'scale':
        case 'scaleX':
        case 'scaleY':
          return `${key}(${value})`;
        case 'rotate':
          return `rotate(${value})`;
        default:
          return `${key}(${value})`;
      }
    }).join(' ');
  }

  // 驼峰转短横线
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // 生成 CSS
  private generateCSS(styles: Record<string, any>, componentName: string): void {
    const cssRules: string[] = [];

    Object.entries(styles).forEach(([className, style]) => {
      const selector = `.${componentName}-${className}`;
      const properties = Object.entries(style)
        .map(([prop, value]) => `  ${prop}: ${value};`)
        .join('\n');
      
      cssRules.push(`${selector} {\n${properties}\n}`);
    });

    const cssText = cssRules.join('\n\n');
    this.cssRules.set(componentName, cssText);
    this.injectCSS(componentName, cssText);
  }

  // 注入 CSS 到页面
  private injectCSS(componentName: string, cssText: string): void {
    const styleId = `cross-platform-${componentName}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.type = 'text/css';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = cssText;
  }

  // 移除组件样式
  removeComponentStyles(componentName: string): void {
    const styleId = `cross-platform-${componentName}`;
    const styleElement = document.getElementById(styleId);
    
    if (styleElement) {
      styleElement.remove();
    }
    
    this.cssRules.delete(componentName);
  }

  // 获取组件的 CSS 类名
  getClassName(componentName: string, styleName: string): string {
    return `${componentName}-${styleName}`;
  }

  // 处理响应式样式
  createResponsiveStyles(styles: Record<string, any>, breakpoints: Record<string, number>): Record<string, any> {
    const responsiveStyles: Record<string, any> = {};

    Object.entries(styles).forEach(([key, style]) => {
      responsiveStyles[key] = style;

      // 处理响应式断点
      Object.entries(breakpoints).forEach(([breakpoint, width]) => {
        const responsiveKey = `${key}@${breakpoint}`;
        if (styles[responsiveKey]) {
          const mediaQuery = `@media (min-width: ${width}px)`;
          responsiveStyles[responsiveKey] = {
            [mediaQuery]: styles[responsiveKey]
          };
        }
      });
    });

    return responsiveStyles;
  }

  // 处理主题样式
  applyTheme(theme: Record<string, any>): void {
    const themeCSS = Object.entries(theme)
      .map(([key, value]) => `--${key}: ${value};`)
      .join('\n  ');

    const themeRule = `:root {\n  ${themeCSS}\n}`;
    this.injectCSS('theme', themeRule);
  }
}