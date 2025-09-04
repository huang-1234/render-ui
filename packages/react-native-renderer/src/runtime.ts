import { Runtime, NavigateOptions, SystemInfo, RequestOptions } from '@cross-platform/core';
import { 
  Dimensions, 
  Platform, 
  StatusBar,
  Alert,
  ToastAndroid,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';

export default class ReactNativeRuntime implements Runtime {
  platform = 'rn' as const;
  isDevelopment = __DEV__;
  isProduction = !__DEV__;

  // 导航相关 - 需要配合导航库使用
  private navigationRef: any = null;

  setNavigationRef(ref: any): void {
    this.navigationRef = ref;
  }

  navigateTo(options: NavigateOptions): void {
    const { url, success, fail } = options;
    
    try {
      if (!this.navigationRef) {
        throw new Error('Navigation ref not set. Please call setNavigationRef first.');
      }

      // 解析 URL 和参数
      const { route, params } = this.parseUrl(url);
      
      this.navigationRef.navigate(route, params);
      success?.();
    } catch (error) {
      fail?.(error);
    }
  }

  redirectTo(options: NavigateOptions): void {
    const { url, success, fail } = options;
    
    try {
      if (!this.navigationRef) {
        throw new Error('Navigation ref not set. Please call setNavigationRef first.');
      }

      const { route, params } = this.parseUrl(url);
      
      // 替换当前路由
      this.navigationRef.reset({
        index: 0,
        routes: [{ name: route, params }]
      });
      
      success?.();
    } catch (error) {
      fail?.(error);
    }
  }

  switchTab(options: NavigateOptions): void {
    // React Native 中 Tab 切换通常通过 Tab Navigator 处理
    this.navigateTo(options);
  }

  // 返回上一页
  goBack(): void {
    if (this.navigationRef && this.navigationRef.canGoBack()) {
      this.navigationRef.goBack();
    }
  }

  // 解析 URL
  private parseUrl(url: string): { route: string; params: Record<string, any> } {
    const [path, queryString] = url.split('?');
    const route = path.replace(/^\//, ''); // 移除开头的斜杠
    
    const params: Record<string, any> = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }
    
    return { route, params };
  }

  // 系统信息
  async getSystemInfo(): Promise<SystemInfo> {
    const { width, height } = Dimensions.get('window');
    const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
    
    return {
      platform: 'rn',
      system: Platform.OS === 'ios' ? 'iOS' : 'Android',
      version: Platform.Version.toString(),
      screenWidth,
      screenHeight,
      windowWidth: width,
      windowHeight: height,
      pixelRatio: Dimensions.get('window').scale,
      statusBarHeight: this.getStatusBarHeight(),
      safeArea: this.getSafeArea(),
      brand: await this.getBrand(),
      model: await this.getModel()
    };
  }

  // 获取状态栏高度
  private getStatusBarHeight(): number {
    if (Platform.OS === 'ios') {
      return getStatusBarHeight();
    } else {
      return StatusBar.currentHeight || 0;
    }
  }

  // 获取安全区域
  private getSafeArea(): { top: number; bottom: number; left: number; right: number } {
    return {
      top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
      bottom: Platform.OS === 'ios' ? getBottomSpace() : 0,
      left: 0,
      right: 0
    };
  }

  // 获取设备品牌
  private async getBrand(): Promise<string> {
    try {
      const DeviceInfo = require('react-native-device-info');
      return await DeviceInfo.getBrand();
    } catch {
      return Platform.OS === 'ios' ? 'Apple' : 'Android';
    }
  }

  // 获取设备型号
  private async getModel(): Promise<string> {
    try {
      const DeviceInfo = require('react-native-device-info');
      return await DeviceInfo.getModel();
    } catch {
      return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
    }
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
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error(`Failed to set storage: ${error}`);
    }
  }

  async getStorage(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
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
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove storage: ${error}`);
    }
  }

  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }

  // UI 相关
  showToast(options: { title: string; duration?: number }): void {
    const { title, duration = 2000 } = options;
    
    if (Platform.OS === 'android') {
      ToastAndroid.show(title, duration > 3000 ? ToastAndroid.LONG : ToastAndroid.SHORT);
    } else {
      // iOS 可以使用第三方库如 react-native-toast-message
      Alert.alert('', title);
    }
  }

  showLoading(options: { title: string }): void {
    // React Native 中通常使用 ActivityIndicator 组件
    // 这里可以触发全局 loading 状态
    console.log('Loading:', options.title);
  }

  hideLoading(): void {
    // 隐藏全局 loading 状态
    console.log('Hide loading');
  }

  showModal(options: {
    title?: string;
    content: string;
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
  }): Promise<{ confirm: boolean; cancel: boolean }> {
    return new Promise((resolve) => {
      const { title, content, showCancel = true, cancelText = '取消', confirmText = '确定' } = options;
      
      const buttons: any[] = [];
      
      if (showCancel) {
        buttons.push({
          text: cancelText,
          onPress: () => resolve({ confirm: false, cancel: true }),
          style: 'cancel'
        });
      }
      
      buttons.push({
        text: confirmText,
        onPress: () => resolve({ confirm: true, cancel: false })
      });

      Alert.alert(title || '提示', content, buttons);
    });
  }

  // 打开外部链接
  async openUrl(url: string): Promise<void> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        throw new Error(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      throw error;
    }
  }

  // 获取剪贴板内容
  async getClipboardData(): Promise<string> {
    try {
      const Clipboard = require('@react-native-clipboard/clipboard');
      return await Clipboard.getString();
    } catch (error) {
      throw new Error(`Failed to get clipboard data: ${error}`);
    }
  }

  // 设置剪贴板内容
  async setClipboardData(data: string): Promise<void> {
    try {
      const Clipboard = require('@react-native-clipboard/clipboard');
      Clipboard.setString(data);
    } catch (error) {
      throw new Error(`Failed to set clipboard data: ${error}`);
    }
  }

  // 震动
  vibrate(pattern?: number | number[]): void {
    try {
      const { Vibration } = require('react-native');
      if (pattern) {
        Vibration.vibrate(pattern);
      } else {
        Vibration.vibrate();
      }
    } catch (error) {
      console.warn('Vibration not supported:', error);
    }
  }

  // 获取网络状态
  async getNetworkType(): Promise<string> {
    try {
      const NetInfo = require('@react-native-netinfo/netinfo');
      const state = await NetInfo.fetch();
      return state.type || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // 监听网络状态变化
  onNetworkStatusChange(callback: (isConnected: boolean) => void): () => void {
    try {
      const NetInfo = require('@react-native-netinfo/netinfo');
      const unsubscribe = NetInfo.addEventListener(state => {
        callback(state.isConnected || false);
      });
      return unsubscribe;
    } catch (error) {
      console.warn('NetInfo not available:', error);
      return () => {};
    }
  }
}