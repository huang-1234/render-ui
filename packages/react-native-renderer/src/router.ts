import { RouteConfig, RouteInfo } from '@cross-platform/core';

export default class ReactNativeRouter {
  private static routes: RouteConfig[] = [];
  private static currentRoute: RouteInfo | null = null;
  private static listeners: Array<(route: RouteInfo) => void> = [];
  private static navigationRef: any = null;
  private static isInitialized = false;

  // 初始化路由
  static init(navigationRef: any): void {
    if (this.isInitialized) return;
    
    this.navigationRef = navigationRef;
    
    // 监听导航状态变化
    if (navigationRef) {
      const unsubscribe = navigationRef.addListener('state', () => {
        this.handleRouteChange();
      });
    }

    this.isInitialized = true;
  }

  // 注册路由
  static registerRoutes(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  // 设置导航引用
  static setNavigationRef(ref: any): void {
    this.navigationRef = ref;
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
    if (!this.navigationRef) {
      console.warn('Navigation ref not set');
      return;
    }

    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    try {
      // React Navigation 使用 screen name 进行导航
      const screenName = this.getScreenName(path);
      this.navigationRef.navigate(screenName, params);
      
      this.updateCurrentRoute(path, params || {});
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }

  // 替换当前路由
  static redirectTo(path: string, params?: Record<string, any>): void {
    if (!this.navigationRef) {
      console.warn('Navigation ref not set');
      return;
    }

    const route = this.findRoute(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    try {
      const screenName = this.getScreenName(path);
      
      // 使用 reset 来替换整个导航栈
      this.navigationRef.reset({
        index: 0,
        routes: [{ name: screenName, params }]
      });
      
      this.updateCurrentRoute(path, params || {});
    } catch (error) {
      console.error('Redirect failed:', error);
    }
  }

  // 返回上一页
  static goBack(): void {
    if (!this.navigationRef) {
      console.warn('Navigation ref not set');
      return;
    }

    if (this.navigationRef.canGoBack()) {
      this.navigationRef.goBack();
    }
  }

  // 返回到指定页面
  static goBackTo(path: string): void {
    if (!this.navigationRef) {
      console.warn('Navigation ref not set');
      return;
    }

    const screenName = this.getScreenName(path);
    
    try {
      // 弹出到指定页面
      this.navigationRef.popTo(screenName);
    } catch (error) {
      console.error('Go back to failed:', error);
    }
  }

  // 返回到根页面
  static goBackToRoot(): void {
    if (!this.navigationRef) {
      console.warn('Navigation ref not set');
      return;
    }

    try {
      this.navigationRef.popToTop();
    } catch (error) {
      console.error('Go back to root failed:', error);
    }
  }

  // 获取导航状态
  static getNavigationState(): any {
    if (!this.navigationRef) {
      return null;
    }

    return this.navigationRef.getRootState();
  }

  // 获取当前屏幕名称
  static getCurrentScreenName(): string | null {
    if (!this.navigationRef) {
      return null;
    }

    const state = this.navigationRef.getRootState();
    if (!state) return null;

    // 递归查找当前活跃的路由
    const findActiveRoute = (routes: any[]): any => {
      const activeRoute = routes[routes.length - 1];
      if (activeRoute.state) {
        return findActiveRoute(activeRoute.state.routes);
      }
      return activeRoute;
    };

    const activeRoute = findActiveRoute(state.routes);
    return activeRoute?.name || null;
  }

  // 获取路由参数
  static getParams(): Record<string, any> {
    if (!this.navigationRef) {
      return {};
    }

    const state = this.navigationRef.getRootState();
    if (!state) return {};

    // 获取当前活跃路由的参数
    const findActiveRoute = (routes: any[]): any => {
      const activeRoute = routes[routes.length - 1];
      if (activeRoute.state) {
        return findActiveRoute(activeRoute.state.routes);
      }
      return activeRoute;
    };

    const activeRoute = findActiveRoute(state.routes);
    return activeRoute?.params || {};
  }

  // 处理路由变化
  private static handleRouteChange(): void {
    const screenName = this.getCurrentScreenName();
    const params = this.getParams();
    
    if (screenName) {
      const path = this.getPathFromScreenName(screenName);
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

  // 获取屏幕名称
  private static getScreenName(path: string): string {
    // 将路径转换为屏幕名称
    // 例如: /user/profile -> UserProfile
    return path
      .split('/')
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join('');
  }

  // 从屏幕名称获取路径
  private static getPathFromScreenName(screenName: string): string {
    // 这里需要维护一个屏幕名称到路径的映射
    // 简化实现，实际应该更复杂
    const route = this.routes.find(r => {
      const name = this.getScreenName(r.path);
      return name === screenName;
    });
    
    return route?.path || `/${screenName.toLowerCase()}`;
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

  // 预加载路由
  static preloadRoute(path: string): void {
    const route = this.findRoute(path);
    if (route && route.component) {
      // 预加载组件
      try {
        if (typeof route.component === 'function') {
          // 如果是懒加载组件，触发加载
          route.component();
        }
      } catch (error) {
        console.warn('Preload route failed:', error);
      }
    }
  }

  // 清理路由缓存
  static clearRouteCache(): void {
    // 清理路由相关的缓存
    this.currentRoute = null;
  }
}