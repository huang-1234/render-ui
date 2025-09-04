import { RouteConfig, RouteInfo } from '@cross-platform/core';

export default class H5Router {
  private static routes: RouteConfig[] = [];
  private static currentRoute: RouteInfo | null = null;
  private static listeners: Array<(route: RouteInfo) => void> = [];
  private static isInitialized = false;

  // 初始化路由
  static init(): void {
    if (this.isInitialized) return;
    
    // 监听浏览器前进后退
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    // 监听页面加载
    window.addEventListener('DOMContentLoaded', () => {
      this.handleRouteChange();
    });

    this.isInitialized = true;
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
    
    // 返回取消监听的函数
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
    window.history.pushState({ path, params }, '', url);
    this.handleRouteChange();
  }

  // 替换当前路由
  static redirectTo(path: string, params?: Record<string, any>): void {
    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    const url = this.buildUrl(path, params);
    window.history.replaceState({ path, params }, '', url);
    this.handleRouteChange();
  }

  // 返回上一页
  static goBack(): void {
    window.history.back();
  }

  // 前进到下一页
  static goForward(): void {
    window.history.forward();
  }

  // 获取路由参数
  static getParams(): Record<string, any> {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};
    
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    return params;
  }

  // 获取路由查询参数
  static getQuery(): Record<string, string> {
    const urlParams = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};
    
    for (const [key, value] of urlParams.entries()) {
      query[key] = value;
    }
    
    return query;
  }

  // 处理浏览器前进后退
  private static handlePopState(event: PopStateEvent): void {
    this.handleRouteChange();
  }

  // 处理路由变化
  private static handleRouteChange(): void {
    const path = window.location.pathname;
    const params = this.getParams();
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
    // 精确匹配
    let route = this.routes.find(r => r.path === path);
    
    if (!route) {
      // 动态路由匹配
      route = this.routes.find(r => {
        const pattern = r.path.replace(/:\w+/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(path);
      });
    }
    
    return route;
  }

  // 构建 URL
  private static buildUrl(path: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${path}?${queryString}` : path;
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

  // 检查路由是否匹配
  static isRouteMatch(routePath: string, actualPath: string): boolean {
    const pattern = routePath.replace(/:\w+/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(actualPath);
  }
}