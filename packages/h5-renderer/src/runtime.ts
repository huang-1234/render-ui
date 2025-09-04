import { Runtime, NavigateOptions, SystemInfo, RequestOptions } from '@cross-platform/core';

export default class H5Runtime implements Runtime {
  platform = 'h5' as const;
  isDevelopment = process.env.NODE_ENV === 'development';
  isProduction = process.env.NODE_ENV === 'production';

  // 导航相关
  navigateTo(options: NavigateOptions): void {
    const { url, success, fail } = options;
    try {
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        window.history.pushState(null, '', url);
        // 触发路由变化事件
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      success?.();
    } catch (error) {
      fail?.(error);
    }
  }

  redirectTo(options: NavigateOptions): void {
    const { url, success, fail } = options;
    try {
      if (url.startsWith('http')) {
        window.location.replace(url);
      } else {
        window.history.replaceState(null, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      success?.();
    } catch (error) {
      fail?.(error);
    }
  }

  switchTab(options: NavigateOptions): void {
    // H5 中 switchTab 和 navigateTo 行为一致
    this.navigateTo(options);
  }

  // 系统信息
  async getSystemInfo(): Promise<SystemInfo> {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    
    return {
      platform: 'h5',
      system: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Unknown',
      version: this.getOSVersion(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      statusBarHeight: this.getStatusBarHeight(),
      safeArea: this.getSafeArea(),
      brand: this.getBrand(),
      model: this.getModel()
    };
  }

  // 网络请求
  async request(options: RequestOptions): Promise<any> {
    const { url, method = 'GET', data, header = {}, timeout = 10000 } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...header
        },
        signal: controller.signal
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        data: result,
        statusCode: response.status,
        header: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // 存储相关
  async setStorage(key: string, data: any): Promise<void> {
    try {
      const value = typeof data === 'string' ? data : JSON.stringify(data);
      localStorage.setItem(key, value);
    } catch (error) {
      throw new Error(`Failed to set storage: ${error}`);
    }
  }

  async getStorage(key: string): Promise<any> {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        throw new Error(`Storage key "${key}" not found`);
      }
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      throw error;
    }
  }

  async removeStorage(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clearStorage(): Promise<void> {
    localStorage.clear();
  }

  // 私有方法
  private getOSVersion(): string {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(?:OS|Android)\s+([\d_\.]+)/);
    return match ? match[1].replace(/_/g, '.') : 'Unknown';
  }

  private getStatusBarHeight(): number {
    // H5 中状态栏高度通过 CSS 环境变量获取
    const style = getComputedStyle(document.documentElement);
    const height = style.getPropertyValue('--status-bar-height') || 
                  style.getPropertyValue('env(safe-area-inset-top)');
    return height ? parseInt(height) : 0;
  }

  private getSafeArea(): { top: number; bottom: number; left: number; right: number } {
    const style = getComputedStyle(document.documentElement);
    
    return {
      top: this.parseCSSValue(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
      bottom: this.parseCSSValue(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
      left: this.parseCSSValue(style.getPropertyValue('env(safe-area-inset-left)')) || 0,
      right: this.parseCSSValue(style.getPropertyValue('env(safe-area-inset-right)')) || 0
    };
  }

  private parseCSSValue(value: string): number {
    if (!value) return 0;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  private getBrand(): string {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(userAgent)) return 'Apple';
    if (/Samsung/.test(userAgent)) return 'Samsung';
    if (/Huawei/.test(userAgent)) return 'Huawei';
    if (/Xiaomi/.test(userAgent)) return 'Xiaomi';
    if (/OPPO/.test(userAgent)) return 'OPPO';
    if (/vivo/.test(userAgent)) return 'vivo';
    return 'Unknown';
  }

  private getModel(): string {
    const userAgent = navigator.userAgent;
    
    // iPhone 型号识别
    if (/iPhone/.test(userAgent)) {
      const match = userAgent.match(/iPhone\s*([^;)]+)/);
      return match ? match[1].trim() : 'iPhone';
    }
    
    // Android 型号识别
    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/;\s*([^)]+)\s*\)/);
      return match ? match[1].trim() : 'Android Device';
    }
    
    return 'Unknown';
  }
}