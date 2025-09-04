import { ComponentType } from 'react';
import { Runtime, getCurrentRuntime } from './runtime';

// 路由配置接口
export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  name?: string;
  meta?: Record<string, any>;
  children?: RouteConfig[];
}

// 路由信息接口
export interface RouteInfo {
  path: string;
  params: Record<string, any>;
  query: Record<string, any>;
  component: ComponentType<any>;
  meta?: Record<string, any>;
}

// 路由守卫类型
export type RouteGuard = (
  to: RouteInfo,
  from: RouteInfo | null
) => boolean | Promise<boolean>;

// 路由变化监听器
export type RouteChangeListener = (route: RouteInfo, prevRoute: RouteInfo | null) => void;

// 路由器类
export class Router {
  private static instance: Router;
  private routes: Map<string, RouteConfig> = new Map();
  private currentRoute: RouteInfo | null = null;
  private listeners: RouteChangeListener[] = [];
  private guards: RouteGuard[] = [];
  private runtime: Runtime;

  private constructor() {
    this.runtime = getCurrentRuntime();
  }

  // 获取路由器单例
  static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  // 注册路由
  registerRoutes(routes: RouteConfig[]): void {
    routes.forEach(route => {
      this.registerRoute(route);
    });
  }

  // 注册单个路由
  private registerRoute(route: RouteConfig, parentPath = ''): void {
    const fullPath = this.normalizePath(parentPath + route.path);
    this.routes.set(fullPath, route);

    // 递归注册子路由
    if (route.children) {
      route.children.forEach(child => {
        this.registerRoute(child, fullPath);
      });
    }
  }

  // 标准化路径
  private normalizePath(path: string): string {
    // 移除重复的斜杠
    path = path.replace(/\/+/g, '/');
    // 确保以斜杠开头
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    // 移除末尾斜杠（除非是根路径）
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  }

  // 查找路由
  private findRoute(path: string): RouteConfig | null {
    const normalizedPath = this.normalizePath(path);
    
    // 精确匹配
    if (this.routes.has(normalizedPath)) {
      return this.routes.get(normalizedPath)!;
    }

    // 动态路由匹配
    for (const [routePath, config] of this.routes) {
      if (this.matchDynamicRoute(routePath, normalizedPath)) {
        return config;
      }
    }

    return null;
  }

  // 匹配动态路由
  private matchDynamicRoute(routePath: string, actualPath: string): boolean {
    const routeSegments = routePath.split('/');
    const actualSegments = actualPath.split('/');

    if (routeSegments.length !== actualSegments.length) {
      return false;
    }

    return routeSegments.every((segment, index) => {
      // 动态参数匹配 :param
      if (segment.startsWith(':')) {
        return true;
      }
      // 通配符匹配 *
      if (segment === '*') {
        return true;
      }
      // 精确匹配
      return segment === actualSegments[index];
    });
  }

  // 提取路由参数
  private extractParams(routePath: string, actualPath: string): Record<string, string> {
    const params: Record<string, string> = {};
    const routeSegments = routePath.split('/');
    const actualSegments = actualPath.split('/');

    routeSegments.forEach((segment, index) => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        params[paramName] = actualSegments[index];
      }
    });

    return params;
  }

  // 解析查询参数
  private parseQuery(url: string): Record<string, string> {
    const query: Record<string, string> = {};
    const queryString = url.split('?')[1];

    if (queryString) {
      const pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
          query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      });
    }

    return query;
  }

  // 构建 URL
  private buildUrl(path: string, params?: Record<string, any>): string {
    let url = path;

    // 替换路径参数
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });

      // 添加查询参数
      const queryParams = Object.entries(params).filter(([key]) => 
        !url.includes(`:${key}`)
      );

      if (queryParams.length > 0) {
        const query = new URLSearchParams();
        queryParams.forEach(([key, value]) => {
          query.append(key, String(value));
        });
        url += `?${query.toString()}`;
      }
    }

    return url;
  }

  // 导航到指定路径
  async navigateTo(path: string, params?: Record<string, any>): Promise<void> {
    const route = this.findRoute(path);
    if (!route) {
      throw new Error(`Route not found: ${path}`);
    }

    const routeInfo: RouteInfo = {
      path: this.normalizePath(path),
      params: this.extractParams(path, this.normalizePath(path)),
      query: this.parseQuery(path),
      component: route.component,
      meta: route.meta
    };

    // 合并传入的参数
    if (params) {
      Object.assign(routeInfo.params, params);
    }

    // 执行路由守卫
    const canNavigate = await this.executeGuards(routeInfo, this.currentRoute);
    if (!canNavigate) {
      return;
    }

    // 调用平台特定的导航方法
    const url = this.buildUrl(path, params);
    
    try {
      await this.runtime.navigateTo({
        url,
        success: () => {
          this.setCurrentRoute(routeInfo);
        }
      });
    } catch (error) {
      console.error('Navigation failed:', error);
      throw error;
    }
  }

  // 重定向到指定路径
  async redirectTo(path: string, params?: Record<string, any>): Promise<void> {
    const route = this.findRoute(path);
    if (!route) {
      throw new Error(`Route not found: ${path}`);
    }

    const routeInfo: RouteInfo = {
      path: this.normalizePath(path),
      params: this.extractParams(path, this.normalizePath(path)),
      query: this.parseQuery(path),
      component: route.component,
      meta: route.meta
    };

    if (params) {
      Object.assign(routeInfo.params, params);
    }

    const canNavigate = await this.executeGuards(routeInfo, this.currentRoute);
    if (!canNavigate) {
      return;
    }

    const url = this.buildUrl(path, params);
    
    try {
      await this.runtime.redirectTo({
        url,
        success: () => {
          this.setCurrentRoute(routeInfo);
        }
      });
    } catch (error) {
      console.error('Redirect failed:', error);
      throw error;
    }
  }

  // 切换标签页
  async switchTab(path: string): Promise<void> {
    const route = this.findRoute(path);
    if (!route) {
      throw new Error(`Route not found: ${path}`);
    }

    const routeInfo: RouteInfo = {
      path: this.normalizePath(path),
      params: {},
      query: {},
      component: route.component,
      meta: route.meta
    };

    const canNavigate = await this.executeGuards(routeInfo, this.currentRoute);
    if (!canNavigate) {
      return;
    }

    try {
      await this.runtime.switchTab({
        url: path,
        success: () => {
          this.setCurrentRoute(routeInfo);
        }
      });
    } catch (error) {
      console.error('Switch tab failed:', error);
      throw error;
    }
  }

  // 返回上一页
  async navigateBack(delta = 1): Promise<void> {
    try {
      await this.runtime.navigateBack(delta);
      // 注意：这里无法准确知道返回后的路由信息
      // 在实际应用中可能需要维护路由历史栈
    } catch (error) {
      console.error('Navigate back failed:', error);
      throw error;
    }
  }

  // 设置当前路由
  private setCurrentRoute(route: RouteInfo): void {
    const prevRoute = this.currentRoute;
    this.currentRoute = route;
    this.notifyListeners(route, prevRoute);
  }

  // 获取当前路由
  getCurrentRoute(): RouteInfo | null {
    return this.currentRoute;
  }

  // 添加路由变化监听器
  addListener(listener: RouteChangeListener): () => void {
    this.listeners.push(listener);
    
    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 通知监听器
  private notifyListeners(route: RouteInfo, prevRoute: RouteInfo | null): void {
    this.listeners.forEach(listener => {
      try {
        listener(route, prevRoute);
      } catch (error) {
        console.error('Route listener error:', error);
      }
    });
  }

  // 添加路由守卫
  addGuard(guard: RouteGuard): () => void {
    this.guards.push(guard);
    
    return () => {
      const index = this.guards.indexOf(guard);
      if (index > -1) {
        this.guards.splice(index, 1);
      }
    };
  }

  // 执行路由守卫
  private async executeGuards(to: RouteInfo, from: RouteInfo | null): Promise<boolean> {
    for (const guard of this.guards) {
      try {
        const result = await guard(to, from);
        if (!result) {
          return false;
        }
      } catch (error) {
        console.error('Route guard error:', error);
        return false;
      }
    }
    return true;
  }

  // 清除所有路由
  clear(): void {
    this.routes.clear();
    this.currentRoute = null;
    this.listeners.length = 0;
    this.guards.length = 0;
  }
}

// 导出路由器实例
export const router = Router.getInstance();

// 便捷方法
export const navigateTo = router.navigateTo.bind(router);
export const redirectTo = router.redirectTo.bind(router);
export const switchTab = router.switchTab.bind(router);
export const navigateBack = router.navigateBack.bind(router);
export const getCurrentRoute = router.getCurrentRoute.bind(router);
export const addRouteListener = router.addListener.bind(router);
export const addRouteGuard = router.addGuard.bind(router);
export const registerRoutes = router.registerRoutes.bind(router);