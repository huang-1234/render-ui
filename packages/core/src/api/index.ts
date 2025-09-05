import { Platform, Dimensions, PixelRatio, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 基础字体大小
const baseFontSize = 12;

/**
 * 将像素值转换为rem单位
 * @param px 像素值
 * @returns rem字符串
 */
export function rem(px: number): string {
  return `${px / baseFontSize}rem`;
}

/**
 * 将像素值转换为rpx单位
 * @param px 像素值
 * @returns rpx字符串
 */
export function rpx(px: number): string {
  return `${px / baseFontSize}rpx`;
}

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export function getPixelRatio(): number {
  return PixelRatio.get();
}

/**
 * 获取屏幕尺寸
 * @returns 屏幕宽高对象
 */
export function getScreenDimensions() {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    pixelRatio: getPixelRatio(),
  };
}

/**
 * 计算安全区域
 * @returns 安全区域对象
 */
export function getSafeAreaInsets() {
  // 在组件中使用 useSafeAreaInsets 钩子获取
  // 这里提供一个基础实现
  const statusBarHeight = StatusBar.currentHeight || 0;
  return {
    top: statusBarHeight,
    bottom: 0, // 在组件中应使用 useSafeAreaInsets
    left: 0,
    right: 0
  };
}

/**
 * 判断是否为iOS设备
 * @returns 是否为iOS设备
 */
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

/**
 * 判断是否为Android设备
 * @returns 是否为Android设备
 */
export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

// ========== 路由相关 ==========

/**
 * 页面跳转
 * @param url 目标URL
 * @param params 参数对象
 */
export function go(url: string, params?: Record<string, any>): void {
  try {
    const { Navigation } = require('@react-navigation/native');

    if (params) {
      Navigation.navigate(url, params);
    } else {
      Navigation.navigate(url);
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
}

/**
 * 返回上一页
 * @param delta 返回的层级数
 */
export function back(delta: number = 1): void {
  try {
    const { Navigation } = require('@react-navigation/native');
    Navigation.goBack();
  } catch (error) {
    console.error('Navigation back error:', error);
  }
}

/**
 * 重定向到指定页面
 * @param url 目标URL
 * @param params 参数对象
 */
export function redirect(url: string, params?: Record<string, any>): void {
  try {
    const { Navigation } = require('@react-navigation/native');

    if (params) {
      Navigation.reset({
        index: 0,
        routes: [{ name: url, params }],
      });
    } else {
      Navigation.reset({
        index: 0,
        routes: [{ name: url }],
      });
    }
  } catch (error) {
    console.error('Navigation redirect error:', error);
  }
}

/**
 * 切换到指定Tab
 * @param url Tab名称
 */
export function switchTab(url: string): void {
  try {
    const { Navigation } = require('@react-navigation/native');
    Navigation.navigate(url);
  } catch (error) {
    console.error('Switch tab error:', error);
  }
}

/**
 * 返回上一页
 * @param delta 返回的层级数
 */
export function navigateBack(delta: number = 1): void {
  back(delta);
}

// ========== 设备相关 ==========

/**
 * 获取设备信息
 * @returns 设备信息对象
 */
export function getDeviceInfo() {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isTablet: Platform.OS === 'ios' ? Platform.isPad : false,
    brand: '',
    model: '',
  };
}

/**
 * 获取状态栏高度
 * @returns 状态栏高度
 */
export function getStatusBarHeight(): number {
  return StatusBar.currentHeight || (isIOS() ? 20 : 0);
}

/**
 * 获取底部安全区域高度
 * 注意：此函数在组件外无法直接使用，应在组件内使用useSafeAreaInsets钩子
 * @returns 底部安全区域高度
 */
export function getBottomSafeAreaHeight(): number {
  // 在React Native中，需要在组件内使用useSafeAreaInsets钩子获取
  return 0; // 默认返回0，实际使用时应使用钩子
}

/**
 * 像素转换为DP
 * @param px 像素值
 * @returns DP值
 */
export function px2dp(px: number): number {
  return px / getPixelRatio();
}

/**
 * DP转换为像素
 * @param dp DP值
 * @returns 像素值
 */
export function dp2px(dp: number): number {
  return dp * getPixelRatio();
}