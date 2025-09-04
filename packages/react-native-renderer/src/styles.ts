import { StyleSheet, Dimensions, Platform } from 'react-native';
import { StyleManager as BaseStyleManager } from '@cross-platform/core';

export default class ReactNativeStyleManager extends BaseStyleManager {
  private static instance: ReactNativeStyleManager;
  private styles: Map<string, any> = new Map();
  private screenData = Dimensions.get('window');

  static getInstance(): ReactNativeStyleManager {
    if (!ReactNativeStyleManager.instance) {
      ReactNativeStyleManager.instance = new ReactNativeStyleManager();
    }
    return ReactNativeStyleManager.instance;
  }

  constructor() {
    super();
    
    // 监听屏幕尺寸变化
    this.subscribeToOrientationChange();
  }

  // 创建样式
  create<T extends Record<string, any>>(styles: T, componentName: string): T {
    const adaptedStyles = this.adaptStyles(styles);
    const styleSheet = StyleSheet.create(adaptedStyles);
    this.styles.set(componentName, styleSheet);
    return styleSheet as T;
  }

  // 适配样式到 React Native
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
    // React Native 已经使用驼峰命名，大部分属性不需要转换
    const propertyMap: Record<string, string> = {
      // 一些特殊映射
      'boxShadow': 'shadowColor', // 需要拆分处理
      'textDecoration': 'textDecorationLine',
      'textDecorationColor': 'textDecorationColor',
      'textDecorationStyle': 'textDecorationStyle',
      'userSelect': 'selectable',
      'cursor': 'pointerEvents'
    };

    return propertyMap[property] || property;
  }

  // 适配属性值
  private adaptValue(property: string, value: any): any {
    if (value === null || value === undefined) {
      return undefined;
    }

    // 处理字符串值中的单位
    if (typeof value === 'string') {
      // 移除 px 单位，React Native 使用数字
      if (value.endsWith('px')) {
        return parseFloat(value);
      }
      
      // 处理百分比
      if (value.endsWith('%')) {
        return value;
      }
      
      // 处理 rem/em 单位
      if (value.endsWith('rem') || value.endsWith('em')) {
        const num = parseFloat(value);
        return num * 16; // 假设基础字体大小为 16
      }
      
      // 处理 vw/vh 单位
      if (value.endsWith('vw')) {
        const num = parseFloat(value);
        return (this.screenData.width * num) / 100;
      }
      
      if (value.endsWith('vh')) {
        const num = parseFloat(value);
        return (this.screenData.height * num) / 100;
      }
    }

    // 处理特殊属性
    switch (property) {
      case 'marginHorizontal':
      case 'marginVertical':
      case 'paddingHorizontal':
      case 'paddingVertical':
        return this.convertToNumber(value);
      
      case 'boxShadow':
        return this.adaptBoxShadow(value);
      
      case 'transform':
        return this.adaptTransform(value);
      
      case 'fontWeight':
        return this.adaptFontWeight(value);
      
      case 'textAlign':
        return this.adaptTextAlign(value);
      
      case 'display':
        return this.adaptDisplay(value);
      
      case 'position':
        return this.adaptPosition(value);
      
      case 'overflow':
        return this.adaptOverflow(value);
      
      default:
        return this.convertToNumber(value);
    }
  }

  // 转换为数字
  private convertToNumber(value: any): any {
    if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)) {
      return parseFloat(value);
    }
    return value;
  }

  // 适配 box-shadow
  private adaptBoxShadow(value: string): Record<string, any> {
    // 解析 CSS box-shadow 语法
    // 例如: "0 2px 4px rgba(0,0,0,0.1)"
    const parts = value.split(' ');
    
    if (parts.length >= 3) {
      return {
        shadowOffset: {
          width: parseFloat(parts[0]) || 0,
          height: parseFloat(parts[1]) || 0
        },
        shadowRadius: parseFloat(parts[2]) || 0,
        shadowColor: parts[3] || 'rgba(0,0,0,0.1)',
        shadowOpacity: 1
      };
    }
    
    return {};
  }

  // 适配 transform
  private adaptTransform(transforms: any): any {
    if (typeof transforms === 'string') {
      // 解析 CSS transform 字符串
      // 例如: "translateX(10px) rotate(45deg)"
      return this.parseTransformString(transforms);
    }
    
    if (Array.isArray(transforms)) {
      return transforms.map(transform => {
        const [key, value] = Object.entries(transform)[0];
        return { [key]: this.convertToNumber(value) };
      });
    }
    
    return transforms;
  }

  // 解析 transform 字符串
  private parseTransformString(transformString: string): any[] {
    const transforms: any[] = [];
    const regex = /(\w+)\(([^)]+)\)/g;
    let match;
    
    while ((match = regex.exec(transformString)) !== null) {
      const [, func, value] = match;
      
      switch (func) {
        case 'translateX':
        case 'translateY':
          transforms.push({ [func]: this.convertToNumber(value.replace('px', '')) });
          break;
        case 'scale':
        case 'scaleX':
        case 'scaleY':
          transforms.push({ [func]: parseFloat(value) });
          break;
        case 'rotate':
          transforms.push({ [func]: value });
          break;
        default:
          transforms.push({ [func]: value });
      }
    }
    
    return transforms;
  }

  // 适配字体粗细
  private adaptFontWeight(weight: any): string | number {
    if (typeof weight === 'string') {
      const weightMap: Record<string, string> = {
        'normal': '400',
        'bold': '700',
        'lighter': '300',
        'bolder': '600'
      };
      return weightMap[weight] || weight;
    }
    return weight;
  }

  // 适配文本对齐
  private adaptTextAlign(align: string): string {
    const alignMap: Record<string, string> = {
      'start': 'left',
      'end': 'right'
    };
    return alignMap[align] || align;
  }

  // 适配 display
  private adaptDisplay(display: string): string {
    // React Native 只支持 flex 和 none
    if (display === 'block' || display === 'inline-block') {
      return 'flex';
    }
    return display;
  }

  // 适配 position
  private adaptPosition(position: string): string {
    // React Native 支持 relative 和 absolute
    if (position === 'fixed') {
      return 'absolute';
    }
    return position;
  }

  // 适配 overflow
  private adaptOverflow(overflow: string): string {
    // React Native 支持 visible, hidden, scroll
    const overflowMap: Record<string, string> = {
      'auto': 'scroll',
      'overlay': 'scroll'
    };
    return overflowMap[overflow] || overflow;
  }

  // 监听屏幕方向变化
  private subscribeToOrientationChange(): void {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      this.screenData = window;
      // 重新计算依赖屏幕尺寸的样式
      this.recalculateResponsiveStyles();
    });
  }

  // 重新计算响应式样式
  private recalculateResponsiveStyles(): void {
    // 遍历所有样式，重新计算包含 vw/vh 单位的值
    this.styles.forEach((styleSheet, componentName) => {
      // 这里可以实现样式的重新计算逻辑
    });
  }

  // 获取组件样式
  getComponentStyles(componentName: string): any {
    return this.styles.get(componentName);
  }

  // 移除组件样式
  removeComponentStyles(componentName: string): void {
    this.styles.delete(componentName);
  }

  // 创建响应式样式
  createResponsiveStyles(styles: Record<string, any>, breakpoints: Record<string, number>): Record<string, any> {
    const { width } = this.screenData;
    const responsiveStyles: Record<string, any> = {};

    Object.entries(styles).forEach(([key, style]) => {
      responsiveStyles[key] = style;

      // 根据当前屏幕宽度应用对应的断点样式
      Object.entries(breakpoints).forEach(([breakpoint, breakpointWidth]) => {
        const responsiveKey = `${key}@${breakpoint}`;
        if (styles[responsiveKey] && width >= breakpointWidth) {
          responsiveStyles[key] = { ...responsiveStyles[key], ...styles[responsiveKey] };
        }
      });
    });

    return responsiveStyles;
  }

  // 获取平台特定样式
  getPlatformStyles(iosStyle: any, androidStyle: any): any {
    return Platform.select({
      ios: iosStyle,
      android: androidStyle
    });
  }

  // 合并样式
  mergeStyles(...styles: Array<any>): any {
    return StyleSheet.flatten(styles);
  }

  // 获取屏幕信息
  getScreenData(): { width: number; height: number; scale: number } {
    return {
      ...this.screenData,
      scale: Dimensions.get('window').scale
    };
  }
}