import React from 'react';

// 平台类型定义
export type Platform = 'h5' | 'rn' | 'weapp' | 'alipay' | 'tt' | 'qq' | 'jd';

// 导航选项
export interface NavigateOptions {
  url: string;
  params?: Record<string, any>;
  success?: () => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

// 系统信息
export interface SystemInfo {
  platform: string;
  system: string;
  version: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  pixelRatio: number;
  statusBarHeight: number;
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  brand: string;
  model: string;
}

// 网络请求选项
export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  success?: (response: any) => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

// 存储选项
export interface StorageOptions {
  key: string;
  data?: any;
  success?: (data?: any) => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

// 运行时接口
export interface Runtime {
  // 平台信息
  platform: Platform;
  isDevelopment: boolean;
  isProduction: boolean;

  // 导航 API
  navigateTo(options: NavigateOptions): void;
  redirectTo(options: NavigateOptions): void;
  switchTab(options: NavigateOptions): void;
  navigateBack?(delta?: number): void;

  // 系统信息
  getSystemInfo(): Promise<SystemInfo>;
  getSystemInfoSync(): SystemInfo;

  // 网络请求
  request(options: RequestOptions): Promise<any>;

  // 存储 API
  setStorage(key: string, data: any): Promise<void>;
  getStorage(key: string): Promise<any>;
  removeStorage(key: string): Promise<void>;
  clearStorage(): Promise<void>;
  
  // 同步存储 API
  setStorageSync(key: string, data: any): void;
  getStorageSync(key: string): any;
  removeStorageSync(key: string): void;
  clearStorageSync(): void;

  // 界面 API
  showToast(options: { title: string; icon?: string; duration?: number }): Promise<void>;
  showModal(options: { title?: string; content: string; showCancel?: boolean }): Promise<{ confirm: boolean; cancel: boolean }>;
  showLoading(options: { title: string; mask?: boolean }): Promise<void>;
  hideLoading(): Promise<void>;

  // 设备 API
  vibrateLong(): Promise<void>;
  vibrateShort(): Promise<void>;
  
  // 剪贴板
  setClipboardData(data: string): Promise<void>;
  getClipboardData(): Promise<string>;

  // 文件系统
  chooseImage(options?: { count?: number; sizeType?: string[]; sourceType?: string[] }): Promise<{ tempFilePaths: string[] }>;
  
  // 位置信息
  getLocation(options?: { type?: string; altitude?: boolean }): Promise<{ latitude: number; longitude: number; altitude?: number }>;
}

// 创建运行时实例
export function createRuntime(platform: Platform): Runtime {
  switch (platform) {
    case 'h5':
      return createH5Runtime();
    case 'rn':
      return createRNRuntime();
    case 'weapp':
      return createWeappRuntime();
    case 'alipay':
      return createAlipayRuntime();
    case 'tt':
      return createTTRuntime();
    default:
      throw new Error(`不支持的平台: ${platform}`);
  }
}

// H5 运行时实现
function createH5Runtime(): Runtime {
  return {
    platform: 'h5',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    async navigateTo(options: NavigateOptions) {
      const url = buildUrl(options.url, options.params);
      window.history.pushState(null, '', url);
      options.success?.();
    },

    async redirectTo(options: NavigateOptions) {
      const url = buildUrl(options.url, options.params);
      window.location.replace(url);
      options.success?.();
    },

    async switchTab(options: NavigateOptions) {
      // H5 中的 tab 切换逻辑
      await this.navigateTo(options);
    },

    async navigateBack(delta = 1) {
      window.history.go(-delta);
    },

    async getSystemInfo(): Promise<SystemInfo> {
      return {
        platform: 'h5',
        system: navigator.platform,
        version: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        statusBarHeight: 0,
        safeArea: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
        brand: 'Browser',
        model: 'Web'
      };
    },

    getSystemInfoSync(): SystemInfo {
      return {
        platform: 'h5',
        system: navigator.platform,
        version: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        statusBarHeight: 0,
        safeArea: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
        brand: 'Browser',
        model: 'Web'
      };
    },

    async request(options: RequestOptions): Promise<any> {
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.data ? JSON.stringify(options.data) : undefined
      });
      
      const data = await response.json();
      options.success?.(data);
      return data;
    },

    async setStorage(key: string, data: any): Promise<void> {
      localStorage.setItem(key, JSON.stringify(data));
    },

    async getStorage(key: string): Promise<any> {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

    async removeStorage(key: string): Promise<void> {
      localStorage.removeItem(key);
    },

    async clearStorage(): Promise<void> {
      localStorage.clear();
    },

    setStorageSync(key: string, data: any): void {
      localStorage.setItem(key, JSON.stringify(data));
    },

    getStorageSync(key: string): any {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

    removeStorageSync(key: string): void {
      localStorage.removeItem(key);
    },

    clearStorageSync(): void {
      localStorage.clear();
    },

    async showToast(options: { title: string; icon?: string; duration?: number }): Promise<void> {
      // H5 toast 实现
      console.log(`Toast: ${options.title}`);
    },

    async showModal(options: { title?: string; content: string; showCancel?: boolean }): Promise<{ confirm: boolean; cancel: boolean }> {
      const result = window.confirm(`${options.title || ''}\n${options.content}`);
      return { confirm: result, cancel: !result };
    },

    async showLoading(options: { title: string; mask?: boolean }): Promise<void> {
      console.log(`Loading: ${options.title}`);
    },

    async hideLoading(): Promise<void> {
      console.log('Hide loading');
    },

    async vibrateLong(): Promise<void> {
      if (navigator.vibrate) {
        navigator.vibrate(1000);
      }
    },

    async vibrateShort(): Promise<void> {
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    },

    async setClipboardData(data: string): Promise<void> {
      await navigator.clipboard.writeText(data);
    },

    async getClipboardData(): Promise<string> {
      return await navigator.clipboard.readText();
    },

    async chooseImage(options?: { count?: number; sizeType?: string[]; sourceType?: string[] }): Promise<{ tempFilePaths: string[] }> {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = (options?.count || 1) > 1;
        
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          const tempFilePaths = Array.from(files || []).map(file => URL.createObjectURL(file));
          resolve({ tempFilePaths });
        };
        
        input.click();
      });
    },

    async getLocation(options?: { type?: string; altitude?: boolean }): Promise<{ latitude: number; longitude: number; altitude?: number }> {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: options?.altitude ? (position.coords.altitude ?? undefined) : undefined
            });
          },
          (error) => reject(error)
        );
      });
    }
  };
}

// React Native 运行时实现
function createRNRuntime(): Runtime {
  // 这里需要导入 React Native 的 API
  // 由于这是一个通用的实现，我们使用动态导入
  const { Platform, Dimensions, Alert } = require('react-native');
  
  return {
    platform: 'rn',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    async navigateTo(options: NavigateOptions) {
      // React Native 导航需要配合导航库实现
      console.log('RN navigateTo:', options);
    },

    async redirectTo(options: NavigateOptions) {
      console.log('RN redirectTo:', options);
    },

    async switchTab(options: NavigateOptions) {
      console.log('RN switchTab:', options);
    },

    async navigateBack(delta = 1) {
      console.log('RN navigateBack:', delta);
    },

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
        statusBarHeight: 0,
        safeArea: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
        brand: 'Unknown',
        model: 'Unknown'
      };
    },

    getSystemInfoSync(): SystemInfo {
      const { width, height } = Dimensions.get('window');
      const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
      
      return {
        platform: Platform.OS,
        system: Platform.OS,
        version: Platform.Version.toString(),
        screenWidth,
        screenHeight,
        windowWidth: width,
        windowHeight: height,
        pixelRatio: Platform.select({ ios: 2, android: 1 }) || 1,
        statusBarHeight: Platform.select({ ios: 44, android: 24 }) || 0,
        safeArea: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      };
    },

    async request(options: RequestOptions): Promise<any> {
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.data ? JSON.stringify(options.data) : undefined
      });
      
      const data = await response.json();
      options.success?.(data);
      return data;
    },

    async setStorage(key: string, data: any): Promise<void> {
      const { AsyncStorage } = require('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(key, JSON.stringify(data));
    },

    async getStorage(key: string): Promise<any> {
      const { AsyncStorage } = require('@react-native-async-storage/async-storage');
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

    async removeStorage(key: string): Promise<void> {
      const { AsyncStorage } = require('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem(key);
    },

    async clearStorage(): Promise<void> {
      const { AsyncStorage } = require('@react-native-async-storage/async-storage');
      await AsyncStorage.clear();
    },

    setStorageSync(key: string, data: any): void {
      // RN 没有同步存储，使用异步实现
      this.setStorage(key, data);
    },

    getStorageSync(key: string): any {
      // RN 没有同步存储，返回 null
      return null;
    },

    removeStorageSync(key: string): void {
      this.removeStorage(key);
    },

    clearStorageSync(): void {
      this.clearStorage();
    },

    async showToast(options: { title: string; icon?: string; duration?: number }): Promise<void> {
      const { ToastAndroid, Platform } = require('react-native');
      if (Platform.OS === 'android') {
        ToastAndroid.show(options.title, ToastAndroid.SHORT);
      } else {
        Alert.alert('', options.title);
      }
    },

    async showModal(options: { title?: string; content: string; showCancel?: boolean }): Promise<{ confirm: boolean; cancel: boolean }> {
      return new Promise((resolve) => {
        Alert.alert(
          options.title || '',
          options.content,
          [
            {
              text: '取消',
              onPress: () => resolve({ confirm: false, cancel: true }),
              style: 'cancel'
            },
            {
              text: '确定',
              onPress: () => resolve({ confirm: true, cancel: false })
            }
          ]
        );
      });
    },

    async showLoading(options: { title: string; mask?: boolean }): Promise<void> {
      console.log(`RN Loading: ${options.title}`);
    },

    async hideLoading(): Promise<void> {
      console.log('RN Hide loading');
    },

    async vibrateLong(): Promise<void> {
      const { Vibration } = require('react-native');
      Vibration.vibrate(1000);
    },

    async vibrateShort(): Promise<void> {
      const { Vibration } = require('react-native');
      Vibration.vibrate(200);
    },

    async setClipboardData(data: string): Promise<void> {
      const { Clipboard } = require('@react-native-clipboard/clipboard');
      Clipboard.setString(data);
    },

    async getClipboardData(): Promise<string> {
      const { Clipboard } = require('@react-native-clipboard/clipboard');
      return await Clipboard.getString();
    },

    async chooseImage(options?: { count?: number; sizeType?: string[]; sourceType?: string[] }): Promise<{ tempFilePaths: string[] }> {
      // 需要使用 react-native-image-picker 等库
      console.log('RN chooseImage:', options);
      return { tempFilePaths: [] };
    },

    async getLocation(options?: { type?: string; altitude?: boolean }): Promise<{ latitude: number; longitude: number; altitude?: number }> {
      // 需要使用 @react-native-community/geolocation 等库
      console.log('RN getLocation:', options);
      return { latitude: 0, longitude: 0 };
    }
  };
}

// 微信小程序运行时实现
function createWeappRuntime(): Runtime {
  const wx = (global as any).wx;
  
  return {
    platform: 'weapp',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    async navigateTo(options: NavigateOptions) {
      return new Promise((resolve, reject) => {
        wx.navigateTo({
          url: buildUrl(options.url, options.params),
          success: () => {
            options.success?.();
            resolve();
          },
          fail: (error: any) => {
            options.fail?.(error);
            reject(error);
          },
          complete: options.complete
        });
      });
    },

    async redirectTo(options: NavigateOptions) {
      return new Promise((resolve, reject) => {
        wx.redirectTo({
          url: buildUrl(options.url, options.params),
          success: () => {
            options.success?.();
            resolve();
          },
          fail: (error: any) => {
            options.fail?.(error);
            reject(error);
          },
          complete: options.complete
        });
      });
    },

    async switchTab(options: NavigateOptions) {
      return new Promise((resolve, reject) => {
        wx.switchTab({
          url: options.url,
          success: () => {
            options.success?.();
            resolve();
          },
          fail: (error: any) => {
            options.fail?.(error);
            reject(error);
          },
          complete: options.complete
        });
      });
    },

    async navigateBack(delta = 1) {
      return new Promise((resolve) => {
        wx.navigateBack({
          delta,
          success: resolve
        });
      });
    },

    async getSystemInfo(): Promise<SystemInfo> {
      return new Promise((resolve) => {
        wx.getSystemInfo({
          success: (res: any) => {
            resolve({
              platform: res.platform,
              system: res.system,
              version: res.version,
              screenWidth: res.screenWidth,
              screenHeight: res.screenHeight,
              windowWidth: res.windowWidth,
              windowHeight: res.windowHeight,
              pixelRatio: res.pixelRatio,
              statusBarHeight: res.statusBarHeight,
              safeArea: res.safeArea || { top: 0, bottom: 0, left: 0, right: 0 }
            });
          }
        });
      });
    },

    getSystemInfoSync(): SystemInfo {
      const res = wx.getSystemInfoSync();
      return {
        platform: res.platform,
        system: res.system,
        version: res.version,
        screenWidth: res.screenWidth,
        screenHeight: res.screenHeight,
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        pixelRatio: res.pixelRatio,
        statusBarHeight: res.statusBarHeight,
        safeArea: res.safeArea || { top: 0, bottom: 0, left: 0, right: 0 },
        brand: res.brand || 'Unknown',
        model: res.model || 'Unknown'
      };
    },

    async request(options: RequestOptions): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.request({
          url: options.url,
          method: options.method || 'GET',
          data: options.data,
          header: options.headers,
          timeout: options.timeout,
          success: (res: any) => {
            options.success?.(res.data);
            resolve(res.data);
          },
          fail: (error: any) => {
            options.fail?.(error);
            reject(error);
          },
          complete: options.complete
        });
      });
    },

    async setStorage(key: string, data: any): Promise<void> {
      return new Promise((resolve, reject) => {
        wx.setStorage({
          key,
          data,
          success: resolve,
          fail: reject
        });
      });
    },

    async getStorage(key: string): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key,
          success: (res: any) => resolve(res.data),
          fail: reject
        });
      });
    },

    async removeStorage(key: string): Promise<void> {
      return new Promise((resolve, reject) => {
        wx.removeStorage({
          key,
          success: resolve,
          fail: reject
        });
      });
    },

    async clearStorage(): Promise<void> {
      return new Promise((resolve, reject) => {
        wx.clearStorage({
          success: resolve,
          fail: reject
        });
      });
    },

    setStorageSync(key: string, data: any): void {
      wx.setStorageSync(key, data);
    },

    getStorageSync(key: string): any {
      return wx.getStorageSync(key);
    },

    removeStorageSync(key: string): void {
      wx.removeStorageSync(key);
    },

    clearStorageSync(): void {
      wx.clearStorageSync();
    },

    async showToast(options: { title: string; icon?: string; duration?: number }): Promise<void> {
      return new Promise((resolve) => {
        wx.showToast({
          title: options.title,
          icon: options.icon || 'none',
          duration: options.duration || 1500,
          success: resolve
        });
      });
    },

    async showModal(options: { title?: string; content: string; showCancel?: boolean }): Promise<{ confirm: boolean; cancel: boolean }> {
      return new Promise((resolve) => {
        wx.showModal({
          title: options.title || '',
          content: options.content,
          showCancel: options.showCancel !== false,
          success: (res: any) => {
            resolve({ confirm: res.confirm, cancel: res.cancel });
          }
        });
      });
    },

    async showLoading(options: { title: string; mask?: boolean }): Promise<void> {
      return new Promise((resolve) => {
        wx.showLoading({
          title: options.title,
          mask: options.mask,
          success: resolve
        });
      });
    },

    async hideLoading(): Promise<void> {
      return new Promise((resolve) => {
        wx.hideLoading({
          success: resolve
        });
      });
    },

    async vibrateLong(): Promise<void> {
      return new Promise((resolve) => {
        wx.vibrateLong({
          success: resolve
        });
      });
    },

    async vibrateShort(): Promise<void> {
      return new Promise((resolve) => {
        wx.vibrateShort({
          success: resolve
        });
      });
    },

    async setClipboardData(data: string): Promise<void> {
      return new Promise((resolve, reject) => {
        wx.setClipboardData({
          data,
          success: resolve,
          fail: reject
        });
      });
    },

    async getClipboardData(): Promise<string> {
      return new Promise((resolve, reject) => {
        wx.getClipboardData({
          success: (res: any) => resolve(res.data),
          fail: reject
        });
      });
    },

    async chooseImage(options?: { count?: number; sizeType?: string[]; sourceType?: string[] }): Promise<{ tempFilePaths: string[] }> {
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: options?.count || 9,
          sizeType: options?.sizeType || ['original', 'compressed'],
          sourceType: options?.sourceType || ['album', 'camera'],
          success: (res: any) => resolve({ tempFilePaths: res.tempFilePaths }),
          fail: reject
        });
      });
    },

    async getLocation(options?: { type?: string; altitude?: boolean }): Promise<{ latitude: number; longitude: number; altitude?: number }> {
      return new Promise((resolve, reject) => {
        wx.getLocation({
          type: options?.type || 'wgs84',
          altitude: options?.altitude || false,
          success: (res: any) => resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            altitude: res.altitude
          }),
          fail: reject
        });
      });
    }
  };
}

// 支付宝小程序运行时实现
function createAlipayRuntime(): Runtime {
  const my = (global as any).my;
  
  // 支付宝小程序的实现与微信小程序类似，但 API 略有不同
  // 这里简化实现，实际项目中需要完整适配
  return {
    ...createWeappRuntime(),
    platform: 'alipay'
  };
}

// 抖音小程序运行时实现
function createTTRuntime(): Runtime {
  const tt = (global as any).tt;
  
  // 抖音小程序的实现与微信小程序类似
  return {
    ...createWeappRuntime(),
    platform: 'tt'
  };
}

// 工具函数
function buildUrl(url: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  
  const query = new URLSearchParams(params).toString();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${query}`;
}

// 获取当前运行时实例
let currentRuntime: Runtime | null = null;

export function getCurrentRuntime(): Runtime {
  if (!currentRuntime) {
    // 自动检测平台
    const platform = detectPlatform();
    currentRuntime = createRuntime(platform);
  }
  return currentRuntime;
}

// 设置运行时实例
export function setRuntime(runtime: Runtime): void {
  currentRuntime = runtime;
}

// 平台检测
function detectPlatform(): Platform {
  // 检测微信小程序
  if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
    return 'weapp';
  }
  
  // 检测支付宝小程序
  if (typeof my !== 'undefined' && my.getSystemInfoSync) {
    return 'alipay';
  }
  
  // 检测抖音小程序
  if (typeof tt !== 'undefined' && tt.getSystemInfoSync) {
    return 'tt';
  }
  
  // 检测 React Native
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'rn';
  }
  
  // 默认为 H5
  return 'h5';
}