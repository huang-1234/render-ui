import { Runtime, NavigateOptions, SystemInfo, RequestOptions } from '@cross-platform/core';

// 声明小程序全局对象
declare const wx: any;
declare const my: any;
declare const tt: any;
declare const swan: any;

export default class MiniProgramRuntime implements Runtime {
  platform: 'weapp' | 'alipay' | 'tt' | 'swan';
  isDevelopment = process.env.NODE_ENV === 'development';
  isProduction = process.env.NODE_ENV === 'production';

  private api: any;

  constructor() {
    // 自动检测小程序平台
    this.platform = this.detectPlatform();
    this.api = this.getAPI();
  }

  // 检测小程序平台
  private detectPlatform(): 'weapp' | 'alipay' | 'tt' | 'swan' {
    if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
      return 'weapp'; // 微信小程序
    }
    if (typeof my !== 'undefined' && my.getSystemInfoSync) {
      return 'alipay'; // 支付宝小程序
    }
    if (typeof tt !== 'undefined' && tt.getSystemInfoSync) {
      return 'tt'; // 字节跳动小程序
    }
    if (typeof swan !== 'undefined' && swan.getSystemInfoSync) {
      return 'swan'; // 百度小程序
    }
    return 'weapp'; // 默认微信小程序
  }

  // 获取对应平台的 API 对象
  private getAPI(): any {
    switch (this.platform) {
      case 'weapp':
        return typeof wx !== 'undefined' ? wx : {};
      case 'alipay':
        return typeof my !== 'undefined' ? my : {};
      case 'tt':
        return typeof tt !== 'undefined' ? tt : {};
      case 'swan':
        return typeof swan !== 'undefined' ? swan : {};
      default:
        return {};
    }
  }

  // 导航相关
  navigateTo(options: NavigateOptions): void {
    const { url, success, fail, complete } = options;

    if (!this.api.navigateTo) {
      fail?.(new Error('navigateTo API not available'));
      return;
    }

    this.api.navigateTo({
      url,
      success,
      fail,
      complete
    });
  }

  redirectTo(options: NavigateOptions): void {
    const { url, success, fail, complete } = options;

    if (!this.api.redirectTo) {
      fail?.(new Error('redirectTo API not available'));
      return;
    }

    this.api.redirectTo({
      url,
      success,
      fail,
      complete
    });
  }

  switchTab(options: NavigateOptions): void {
    const { url, success, fail, complete } = options;

    if (!this.api.switchTab) {
      fail?.(new Error('switchTab API not available'));
      return;
    }

    this.api.switchTab({
      url,
      success,
      fail,
      complete
    });
  }

  // 返回上一页
  navigateBack(delta: number = 1): void {
    if (!this.api.navigateBack) {
      console.warn('navigateBack API not available');
      return;
    }

    this.api.navigateBack({
      delta
    });
  }

  // 系统信息
  async getSystemInfo(): Promise<SystemInfo> {
    return new Promise((resolve, reject) => {
      if (!this.api.getSystemInfo) {
        reject(new Error('getSystemInfo API not available'));
        return;
      }

      this.api.getSystemInfo({
        success: (res: any) => {
          const systemInfo: SystemInfo = {
            platform: this.platform,
            system: res.system || 'Unknown',
            version: res.version || res.SDKVersion || 'Unknown',
            screenWidth: res.screenWidth || res.windowWidth || 0,
            screenHeight: res.screenHeight || res.windowHeight || 0,
            windowWidth: res.windowWidth || 0,
            windowHeight: res.windowHeight || 0,
            pixelRatio: res.pixelRatio || 1,
            statusBarHeight: res.statusBarHeight || 0,
            safeArea: this.adaptSafeArea(res.safeArea),
            brand: res.brand || 'Unknown',
            model: res.model || 'Unknown'
          };
          resolve(systemInfo);
        },
        fail: reject
      });
    });
  }

  // 适配安全区域
  private adaptSafeArea(safeArea: any): { top: number; bottom: number; left: number; right: number } {
    if (!safeArea) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    return {
      top: safeArea.top || 0,
      bottom: safeArea.bottom || 0,
      left: safeArea.left || 0,
      right: safeArea.right || 0
    };
  }

  // 网络请求
  async request(options: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.api.request) {
        reject(new Error('request API not available'));
        return;
      }

      const { url, method = 'GET', data, header = {}, timeout = 10000 } = options;

      this.api.request({
        url,
        method: method.toUpperCase(),
        data,
        header,
        timeout,
        success: (res: any) => {
          resolve({
            data: res.data,
            statusCode: res.statusCode,
            header: res.header || {}
          });
        },
        fail: reject
      });
    });
  }

  // 存储相关
  async setStorage(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.api.setStorage) {
        reject(new Error('setStorage API not available'));
        return;
      }

      this.api.setStorage({
        key,
        data,
        success: resolve,
        fail: reject
      });
    });
  }

  async getStorage(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.api.getStorage) {
        reject(new Error('getStorage API not available'));
        return;
      }

      this.api.getStorage({
        key,
        success: (res: any) => resolve(res.data),
        fail: reject
      });
    });
  }

  async removeStorage(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.api.removeStorage) {
        reject(new Error('removeStorage API not available'));
        return;
      }

      this.api.removeStorage({
        key,
        success: resolve,
        fail: reject
      });
    });
  }

  async clearStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.api.clearStorage) {
        reject(new Error('clearStorage API not available'));
        return;
      }

      this.api.clearStorage({
        success: resolve,
        fail: reject
      });
    });
  }

  // 显示提示
  showToast(options: { title: string; icon?: string; duration?: number }): void {
    if (!this.api.showToast) {
      console.warn('showToast API not available');
      return;
    }

    this.api.showToast({
      title: options.title,
      icon: options.icon || 'none',
      duration: options.duration || 2000
    });
  }

  // 显示加载
  showLoading(options: { title: string; mask?: boolean }): void {
    if (!this.api.showLoading) {
      console.warn('showLoading API not available');
      return;
    }

    this.api.showLoading({
      title: options.title,
      mask: options.mask !== false
    });
  }

  // 隐藏加载
  hideLoading(): void {
    if (!this.api.hideLoading) {
      console.warn('hideLoading API not available');
      return;
    }

    this.api.hideLoading();
  }

  // 显示模态对话框
  showModal(options: {
    title?: string;
    content: string;
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
  }): Promise<{ confirm: boolean; cancel: boolean }> {
    return new Promise((resolve) => {
      if (!this.api.showModal) {
        console.warn('showModal API not available');
        resolve({ confirm: false, cancel: true });
        return;
      }

      this.api.showModal({
        title: options.title || '提示',
        content: options.content,
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        success: (res: any) => {
          resolve({
            confirm: res.confirm || false,
            cancel: res.cancel || false
          });
        },
        fail: () => {
          resolve({ confirm: false, cancel: true });
        }
      });
    });
  }

  // 获取当前页面栈
  getCurrentPages(): any[] {
    if (typeof getCurrentPages === 'function') {
      return getCurrentPages();
    }
    return [];
  }

  // 设置导航栏标题
  setNavigationBarTitle(title: string): void {
    if (!this.api.setNavigationBarTitle) {
      console.warn('setNavigationBarTitle API not available');
      return;
    }

    this.api.setNavigationBarTitle({
      title
    });
  }

  // 设置导航栏颜色
  setNavigationBarColor(options: {
    frontColor: string;
    backgroundColor: string;
    animation?: { duration: number; timingFunc: string };
  }): void {
    if (!this.api.setNavigationBarColor) {
      console.warn('setNavigationBarColor API not available');
      return;
    }

    this.api.setNavigationBarColor(options);
  }
}