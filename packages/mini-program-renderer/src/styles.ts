import { StyleManager as BaseStyleManager } from '@cross-platform/core';

export default class MiniProgramStyleManager extends BaseStyleManager {
  private static instance: MiniProgramStyleManager;
  private styles: Map<string, any> = new Map();

  static getInstance(): MiniProgramStyleManager {
    if (!MiniProgramStyleManager.instance) {
      MiniProgramStyleManager.instance = new MiniProgramStyleManager();
    }
    return MiniProgramStyleManager.instance;
  }

  // 创建样式
  create<T extends Record<string, any>>(styles: T, componentName: string): T {
    const adaptedStyles = this.adaptStyles(styles);
    this.styles.set(componentName, adaptedStyles);
    return adaptedStyles as T;
  }

  // 适配样式到小程序
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
      // React Native 到小程序样式属性映射
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
      'elevation': 'box-shadow',
      'textAlign': 'text-align',
      'fontSize': 'font-size',
      'fontWeight': 'font-weight',
      'lineHeight': 'line-height',
      'backgroundColor': 'background-color',
      'borderColor': 'border-color',
      'borderWidth': 'border-width'
    };

    return propertyMap[property] || this.camelToKebab(property);
  }

  // 适配属性值
  private adaptValue(property: string, value: any): any {
    if (value === null || value === undefined) {
      return undefined;
    }

    // 处理数字值，小程序使用 rpx 单位
    if (typeof value === 'number') {
      const noUnitProperties = [
        'opacity', 'z-index', 'flex', 'flex-grow', 'flex-shrink', 
        'order', 'font-weight', 'line-height', 'aspect-ratio'
      ];
      
      if (noUnitProperties.includes(property) || noUnitProperties.includes(this.camelToKebab(property))) {
        return value;
      }
      
      // 小程序推荐使用 rpx 单位
      return `${value * 2}rpx`; // 1px = 2rpx (在 375px 宽度设备上)
    }

    // 处理字符串值中的 px 单位
    if (typeof value === 'string' && value.includes('px')) {
      return value.replace(/(\d+(?:\.\d+)?)px/g, (match, num) => {
        return `${parseFloat(num) * 2}rpx`;
      });
    }

    // 处理特殊属性
    switch (property) {
      case 'marginHorizontal':
      case 'paddingHorizontal':
        return this.convertToRpx(value);
      
      case 'marginVertical':
      case 'paddingVertical':
        return this.convertToRpx(value);
      
      case 'shadowColor':
      case 'shadowOffset':
      case 'shadowOpacity':
      case 'shadowRadius':
        return this.adaptShadow(property, value);
      
      case 'elevation':
        return this.adaptElevation(value);
      
      case 'transform':
        return this.adaptTransform(value);
      
      case 'fontWeight':
        return this.adaptFontWeight(value);
      
      default:
        return value;
    }
  }

  // 转换为 rpx 单位
  private convertToRpx(value: any): string {
    if (typeof value === 'number') {
      return `${value * 2}rpx`;
    }
    if (typeof value === 'string' && value.includes('px')) {
      return value.replace(/(\d+(?:\.\d+)?)px/g, (match, num) => {
        return `${parseFloat(num) * 2}rpx`;
      });
    }
    return value;
  }

  // 适配阴影
  private adaptShadow(property: string, value: any): string {
    // 小程序的 box-shadow 支持有限，简化处理
    if (property === 'elevation') {
      return `0 ${value * 2}rpx ${value * 4}rpx rgba(0, 0, 0, 0.1)`;
    }
    return value;
  }

  // 适配 elevation 到 box-shadow
  private adaptElevation(elevation: number): string {
    if (elevation === 0) return 'none';
    
    const blur = elevation * 4; // rpx 单位
    const opacity = Math.min(0.24, elevation * 0.04);
    
    return `0 ${elevation * 2}rpx ${blur}rpx rgba(0, 0, 0, ${opacity})`;
  }

  // 适配 transform
  private adaptTransform(transforms: any[]): string {
    if (!Array.isArray(transforms)) return '';
    
    return transforms.map(transform => {
      const [key, value] = Object.entries(transform)[0];
      
      switch (key) {
        case 'translateX':
        case 'translateY':
          return `${key}(${this.convertToRpx(value)})`;
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

  // 适配字体粗细
  private adaptFontWeight(weight: any): string | number {
    if (typeof weight === 'string') {
      const weightMap: Record<string, number> = {
        'normal': 400,
        'bold': 700,
        'lighter': 300,
        'bolder': 600
      };
      return weightMap[weight] || weight;
    }
    return weight;
  }

  // 驼峰转短横线
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // 获取组件样式
  getComponentStyles(componentName: string): any {
    return this.styles.get(componentName);
  }

  // 移除组件样式
  removeComponentStyles(componentName: string): void {
    this.styles.delete(componentName);
  }

  // 处理响应式样式（小程序不直接支持媒体查询）
  createResponsiveStyles(styles: Record<string, any>, breakpoints: Record<string, number>): Record<string, any> {
    // 小程序中响应式通常通过 JavaScript 动态设置
    // 这里返回基础样式，响应式逻辑需要在组件中处理
    return styles;
  }

  // 处理主题样式
  applyTheme(theme: Record<string, any>): void {
    // 小程序中主题通常通过 CSS 变量或者动态类名实现
    // 这里可以生成主题相关的样式类
    console.log('Theme applied:', theme);
  }

  // 生成内联样式字符串（用于小程序的 style 属性）
  generateInlineStyle(styleObject: Record<string, any>): string {
    return Object.entries(styleObject)
      .map(([property, value]) => {
        const kebabProperty = this.camelToKebab(property);
        return `${kebabProperty}: ${value}`;
      })
      .join('; ');
  }

  // 合并样式
  mergeStyles(...styles: Array<Record<string, any> | undefined>): Record<string, any> {
    return styles.reduce((merged, style) => {
      if (style) {
        return { ...merged, ...style };
      }
      return merged;
    }, {});
  }

  // 处理条件样式
  conditionalStyle(condition: boolean, trueStyle: Record<string, any>, falseStyle?: Record<string, any>): Record<string, any> {
    return condition ? trueStyle : (falseStyle || {});
  }
}