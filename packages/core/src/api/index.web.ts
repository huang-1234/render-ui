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
  return `${px / baseFontSize}rpx`;
}

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export function getPixelRatio(): number {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.pixelRatio || window.devicePixelRatio || 1;
  } catch (error) {
    return window.devicePixelRatio || 1;
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
      width: systemInfo.screenWidth || window.innerWidth,
      height: systemInfo.screenHeight || window.innerHeight,
      pixelRatio: systemInfo.pixelRatio || window.devicePixelRatio || 1,
      windowWidth: systemInfo.windowWidth || window.innerWidth,
      windowHeight: systemInfo.windowHeight || window.innerHeight
    };
  } catch (error) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
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
    // 降级到原生Web API
  }

  // 检查是否支持 CSS env() 函数
  if (typeof window !== 'undefined' && window.CSS && window.CSS.supports) {
    const supportsEnv = window.CSS.supports('padding-top', 'env(safe-area-inset-top)');

    if (supportsEnv) {
      // 创建临时元素来获取安全区域值
      const testElement = document.createElement('div');
      testElement.style.position = 'fixed';
      testElement.style.top = '0';
      testElement.style.left = '0';
      testElement.style.width = '1px';
      testElement.style.height = '1px';
      testElement.style.visibility = 'hidden';
      testElement.style.paddingTop = 'env(safe-area-inset-top, 0px)';
      testElement.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
      testElement.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
      testElement.style.paddingRight = 'env(safe-area-inset-right, 0px)';

      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const insets = {
        top: parseInt(computedStyle.paddingTop, 10) || 0,
        bottom: parseInt(computedStyle.paddingBottom, 10) || 0,
        left: parseInt(computedStyle.paddingLeft, 10) || 0,
        right: parseInt(computedStyle.paddingRight, 10) || 0
      };

      document.body.removeChild(testElement);
      return insets;
    }
  }

  // 降级方案：根据 User Agent 判断
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isIPhoneX = isIOS && (window.screen.height >= 812 || window.screen.width >= 812);

  if (isIPhoneX) {
    return {
      top: 44, // 状态栏 + 刘海
      bottom: 34, // Home indicator
      left: 0,
      right: 0
    };
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
    return systemInfo.platform === 'ios' || systemInfo.system?.toLowerCase().includes('ios');
  } catch (error) {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }
}

/**
 * 判断是否为Android设备
 * @returns 是否为Android设备
 */
export function isAndroid(): boolean {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.platform === 'android' || systemInfo.system?.toLowerCase().includes('android');
  } catch (error) {
    return /Android/.test(navigator.userAgent);
  }
}

/**
 * 判断是否为移动设备
 * @returns 是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ========== 路由相关 ==========

/**
 * 页面跳转
 * @param url 目标URL
 * @param params 参数对象
 */
export function go(url: string, params?: Record<string, any>): void {
  try {
    if (Taro.navigateTo) {
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
    } else {
      if (params) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
        window.location.href = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      } else {
        window.location.href = url;
      }
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // 降级到原生Web API
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      window.location.href = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    } else {
      window.location.href = url;
    }
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
    // 降级到原生Web API
    window.history.go(-delta);
  }
}

/**
 * 重定向到指定页面
 * @param url 目标URL
 * @param params 参数对象
 */
export function redirect(url: string, params?: Record<string, any>): void {
  try {
    if (Taro.redirectTo) {
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
    } else {
      if (params) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
        window.location.replace(`${url}${url.includes('?') ? '&' : '?'}${queryString}`);
      } else {
        window.location.replace(url);
      }
    }
  } catch (error) {
    console.error('Redirect error:', error);
    // 降级到原生Web API
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      window.location.replace(`${url}${url.includes('?') ? '&' : '?'}${queryString}`);
    } else {
      window.location.replace(url);
    }
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
    // 降级到原生Web API
    window.location.href = url;
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
    // 降级到原生Web API
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);

    return {
      platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web',
      version: '',
      isTablet: /iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)),
      brand: '',
      model: '',
      userAgent: ua
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
    const safeAreaInsets = getSafeAreaInsets();
    return safeAreaInsets.top;
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
 * 获取URL参数
 * @param name 参数名
 * @returns 参数值
 */
export function getUrlParam(name: string): string | null {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * 设置页面标题
 * @param title 标题
 */
export function setDocumentTitle(title: string): void {
  try {
    Taro.setNavigationBarTitle({ title });
  } catch (error) {
    document.title = title;
  }
}