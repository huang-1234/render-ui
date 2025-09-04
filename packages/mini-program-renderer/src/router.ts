import { RouteConfig, RouteInfo } from '@cross-platform/core';

// 声明小程序全局对象
declare const wx: any;
declare const my: any;
declare const tt: any;
declare const swan: any;
declare const getCurrentPages: () => any[];

export default class MiniProgramRouter {
  private static routes: RouteConfig[] = [];
  private static currentRoute: RouteInfo | null = null;
  private static listeners: Array<(route: RouteInfo) => void> = [];
  private static platform: 'weapp' | 'alipay' | 'tt' | 'swan';
  private static api: any;

  // 初始化路由
  static init(): void {
    this.platform = this.detectPlatform();
    this.api = this.getAPI();
    
    // 小程序不需要监听 popstate，页面生命周期会处理路由变化
    this.handleRouteChange();
  }

  // 检测小程序平台
  private static detectPlatform(): 'weapp' | 'alipay' | 'tt' | 'swan' {
    if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
      return 'weapp';
    }
    if (typeof my !== 'undefined' && my.getSystemInfoSync) {
      return 'alipay';
    }
    if (typeof tt !== 'undefined' && tt.getSystemInfoSync) {
      return 'tt';
    }
    if (typeof swan !== 'undefined' && swan.getSystemInfoSync) {
      return 'swan';
    }
    return 'weapp';
  }

  // 获取对应平台的 API 对象
  private static getAPI(): any {
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

  // 注册路由
  static registerRoutes(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  // 获取当前路由
  static getCurrentRoute(): RouteInfo | null {
    return this.currentRoute;
  }

  // 添加路由监听器
  static addListener(listener: (route: RouteInfo) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 导航到指定路由
  static navigateTo(path: string, params?: Record<string, any>): void {
    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    const url = this.buildUrl(path, params);
    
    if (!this.api.navigateTo) {
      console.warn('navigateTo API not available');
      return;
    }

    this.api.navigateTo({
      url,
      success: () => {
        this.updateCurrentRoute(path, params);
      },
      fail: (error: any) => {
        console.error('Navigation failed:', error);
      }
    });
  }

  // 替换当前路由
  static redirectTo(path: string, params?: Record<string, any>): void {
    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    const url = this.buildUrl(path, params);
    
    if (!this.api.redirectTo) {
      console.warn('redirectTo API not available');
      return;
    }

    this.api.redirectTo({
      url,
      success: () => {
        this.updateCurrentRoute(path, params);
      },
      fail: (error: any) => {
        console.error('Redirect failed:', error);
      }
    });
  }

  // 切换到 Tab 页面
  static switchTab(path: string): void {
    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    if (!this.api.switchTab) {
      console.warn('switchTab API not available');
      return;
    }

    this.api.switchTab({
      url: path,
      success: () => {
        this.updateCurrentRoute(path, {});
      },
      fail: (error: any) => {
        console.error('Switch tab failed:', error);
      }
    });
  }

  // 返回上一页
  static goBack(delta: number = 1): void {
    if (!this.api.navigateBack) {
      console.warn('navigateBack API not available');
      return;
    }

    this.api.navigateBack({
      delta,
      success: () => {
        // 更新当前路由信息
        setTimeout(() => {
          this.handleRouteChange();
        }, 100);
      }
    });
  }

  // 重新加载当前页面
  static reLaunch(path: string, params?: Record<string, any>): void {
    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    const url = this.buildUrl(path, params);
    
    if (!this.api.reLaunch) {
      console.warn('reLaunch API not available');
      return;
    }

    this.api.reLaunch({
      url,
      success: () => {
        this.updateCurrentRoute(path, params);
      },
      fail: (error: any) => {
        console.error('ReLaunch failed:', error);
      }
    });
  }

  // 获取当前页面栈
  static getCurrentPages(): any[] {
    if (typeof getCurrentPages === 'function') {
      return getCurrentPages();
    }
    return [];
  }

  // 获取路由参数
  static getParams(): Record<string, any> {
    const pages = this.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage && currentPage.options) {
      return currentPage.options;
    }
    
    return {};
  }

  // 处理路由变化
  private static handleRouteChange(): void {
    const pages = this.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage) {
      const path = currentPage.route || currentPage.__route__ || '';
      const params = currentPage.options || {};
      
      this.updateCurrentRoute(path, params);
    }
  }

  // 更新当前路由
  private static updateCurrentRoute(path: string, params: Record<string, any>): void {
    const route = this.findRoute(path);
    
    if (route) {
      const routeInfo: RouteInfo = {
        path,
        params,
        component: route.component,
        meta: route.meta
      };

      this.currentRoute = routeInfo;
      this.notifyListeners(routeInfo);
    }
  }

  // 查找路由配置
  private static findRoute(path: string): RouteConfig | undefined {
    // 移除开头的斜杠
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    
    // 精确匹配
    let route = this.routes.find(r => {
      const routePath = r.path.startsWith('/') ? r.path.slice(1) : r.path;
      return routePath === normalizedPath;
    });
    
    if (!route) {
      // 动态路由匹配
      route = this.routes.find(r => {
        const routePath = r.path.startsWith('/') ? r.path.slice(1) : r.path;
        const pattern = routePath.replace(/:\w+/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(normalizedPath);
      });
    }
    
    return route;
  }

  // 构建 URL
  private static buildUrl(path: string, params?: Record<string, any>): string {
    // 确保路径以 / 开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    if (!params || Object.keys(params).length === 0) {
      return normalizedPath;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${normalizedPath}?${queryString}` : normalizedPath;
  }

  // 通知监听器
  private static notifyListeners(route: RouteInfo): void {
    this.listeners.forEach(listener => {
      try {
        listener(route);
      } catch (error) {
        console.error('Route listener error:', error);
      }
    });
  }

  // 解析动态路由参数
  static parseRouteParams(routePath: string, actualPath: string): Record<string, string> {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');
    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = actualPart || '';
      }
    }

    return params;
  }

  // 检查是否为 Tab 页面
  static isTabPage(path: string): boolean {
    // 这里需要根据 app.json 中的 tabBar 配置来判断
    // 简化实现，实际应该读取配置文件
    const tabPages = ['/pages/index/index', '/pages/profile/index'];
    return tabPages.includes(path);
  }
}