import React from 'react';

// 平台类型定义
export type Platform = 'h5' | 'rn' | 'weapp' | 'alipay' | 'tt' | 'qq' | 'jd';

// 导航选项
export interface NavigateOptions {
  url: string;
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

// 请求选项
export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

// 运行时接口
export interface Runtime {
  platform: Platform;
  isDevelopment: boolean;
  isProduction: boolean;

  // 导航 API
  navigateTo(options: NavigateOptions): void;
  redirectTo(options: NavigateOptions): void;
  switchTab(options: NavigateOptions): void;
  navigateBack?(delta?: number): void;

  // 系统信息 API
  getSystemInfo(): Promise<SystemInfo>;

  // 网络请求 API
  request(options: RequestOptions): Promise<any>;

  // 存储 API
  setStorage(key: string, data: any): Promise<void>;
  getStorage(key: string): Promise<any>;
  removeStorage(key: string): Promise<void>;
  clearStorage(): Promise<void>;
}

// 当前运行时实例
let currentRuntime: Runtime | null = null;

// 设置当前运行时
export function setCurrentRuntime(runtime: Runtime): void {
  currentRuntime = runtime;
}

// 获取当前运行时
export function getCurrentRuntime(): Runtime {
  if (!currentRuntime) {
    throw new Error('Runtime not initialized. Please call setCurrentRuntime first.');
  }
  return currentRuntime;
}

// 创建运行时工厂函数
export function createRuntime(platform: Platform): Runtime {
  // 这里应该根据平台返回对应的运行时实例
  // 实际实现在各个渲染器包中
  throw new Error(`Runtime for platform ${platform} not implemented. Please use specific renderer package.`);
}