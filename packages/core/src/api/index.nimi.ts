import Taro from '@tarojs/taro';

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
  return `${px}rpx`;  // 小程序中直接使用rpx单位
}

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export function getPixelRatio(): number {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.pixelRatio || 1;
  } catch (error) {
    console.error('Get pixel ratio error:', error);
    return 1;
  }
}

/**
 * 获取屏幕尺寸
 * @returns 屏幕宽高对象
 */
export function getScreenDimensions() {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return {
      width: systemInfo.screenWidth,
      height: systemInfo.screenHeight,
      pixelRatio: systemInfo.pixelRatio || 1,
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight
    };
  } catch (error) {
    console.error('Get screen dimensions error:', error);
    return {
      width: 375,
      height: 667,
      pixelRatio: 1,
      windowWidth: 375,
      windowHeight: 667
    };
  }
}

/**
 * 计算安全区域
 * @returns 安全区域对象
 */
export function getSafeAreaInsets() {
  try {
    const systemInfo = Taro.getSystemInfoSync();

    if (systemInfo.safeArea) {
      return {
        top: systemInfo.safeArea.top,
        bottom: systemInfo.screenHeight - systemInfo.safeArea.bottom,
        left: systemInfo.safeArea.left,
        right: systemInfo.screenWidth - systemInfo.safeArea.right
      };
    }
  } catch (error) {
    console.error('Get safe area insets error:', error);
  }

  return { top: 0, bottom: 0, left: 0, right: 0 };
}

/**
 * 判断是否为iOS设备
 * @returns 是否为iOS设备
 */
export function isIOS(): boolean {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.platform === 'ios' || systemInfo.system.toLowerCase().includes('ios');
  } catch (error) {
    console.error('Check iOS error:', error);
    return false;
  }
}

/**
 * 判断是否为Android设备
 * @returns 是否为Android设备
 */
export function isAndroid(): boolean {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.platform === 'android' || systemInfo.system.toLowerCase().includes('android');
  } catch (error) {
    console.error('Check Android error:', error);
    return false;
  }
}

// ========== 路由相关 ==========

/**
 * 页面跳转
 * @param url 目标URL
 * @param params 参数对象
 */
export function go(url: string, params?: Record<string, any>): void {
  try {
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      Taro.navigateTo({
        url: `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      });
    } else {
      Taro.navigateTo({ url });
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
    Taro.navigateBack({ delta });
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
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      Taro.redirectTo({
        url: `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      });
    } else {
      Taro.redirectTo({ url });
    }
  } catch (error) {
    console.error('Redirect error:', error);
  }
}

/**
 * 切换到指定Tab
 * @param url Tab URL
 */
export function switchTab(url: string): void {
  try {
    Taro.switchTab({ url });
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
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return {
      platform: systemInfo.platform,
      version: systemInfo.version,
      system: systemInfo.system,
      brand: systemInfo.brand,
      model: systemInfo.model,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight,
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
      statusBarHeight: systemInfo.statusBarHeight,
      language: systemInfo.language,
      pixelRatio: systemInfo.pixelRatio
    };
  } catch (error) {
    console.error('Get device info error:', error);
    return {
      platform: '',
      version: '',
      system: '',
      brand: '',
      model: ''
    };
  }
}

/**
 * 获取状态栏高度
 * @returns 状态栏高度
 */
export function getStatusBarHeight(): number {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.statusBarHeight || 0;
  } catch (error) {
    console.error('Get status bar height error:', error);
    return 0;
  }
}

/**
 * 获取底部安全区域高度
 * @returns 底部安全区域高度
 */
export function getBottomSafeAreaHeight(): number {
  try {
    const safeAreaInsets = getSafeAreaInsets();
    return safeAreaInsets.bottom;
  } catch (error) {
    console.error('Get bottom safe area height error:', error);
    return 0;
  }
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

/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPageUrl(): string {
  try {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return currentPage.route || '';
  } catch (error) {
    console.error('Get current page url error:', error);
    return '';
  }
}

/**
 * 获取页面参数
 * @returns 页面参数对象
 */
export function getPageQuery(): Record<string, any> {
  try {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return currentPage.options || {};
  } catch (error) {
    console.error('Get page query error:', error);
    return {};
  }
}

/**
 * 设置页面标题
 * @param title 标题
 */
export function setNavigationBarTitle(title: string): void {
  try {
    Taro.setNavigationBarTitle({ title });
  } catch (error) {
    console.error('Set navigation bar title error:', error);
  }
}