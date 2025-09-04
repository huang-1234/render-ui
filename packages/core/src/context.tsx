import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Runtime, getCurrentRuntime, Platform, SystemInfo } from './runtime';

// Runtime Context
interface RuntimeContextValue {
  runtime: Runtime;
  platform: Platform;
  systemInfo: SystemInfo | null;
  isReady: boolean;
}

const RuntimeContext = createContext<RuntimeContextValue | null>(null);

// Runtime Provider Props
interface RuntimeProviderProps {
  children: ReactNode;
  runtime?: Runtime;
  onReady?: (runtime: Runtime) => void;
}

// Runtime Provider Component
export const RuntimeProvider: React.FC<RuntimeProviderProps> = ({
  children,
  runtime: customRuntime,
  onReady
}) => {
  const [runtime] = useState<Runtime>(() => customRuntime || getCurrentRuntime());
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeRuntime = async () => {
      try {
        // 获取系统信息
        const info = await runtime.getSystemInfo();
        setSystemInfo(info);
        setIsReady(true);
        
        // 调用就绪回调
        onReady?.(runtime);
      } catch (error) {
        console.error('Runtime initialization failed:', error);
        // 即使失败也设置为就绪状态，使用默认值
        setIsReady(true);
      }
    };

    initializeRuntime();
  }, [runtime, onReady]);

  const contextValue: RuntimeContextValue = {
    runtime,
    platform: runtime.platform,
    systemInfo,
    isReady
  };

  return (
    <RuntimeContext.Provider value={contextValue}>
      {children}
    </RuntimeContext.Provider>
  );
};

// useRuntime Hook
export function useRuntime(): RuntimeContextValue {
  const context = useContext(RuntimeContext);
  
  if (!context) {
    throw new Error('useRuntime must be used within a RuntimeProvider');
  }
  
  return context;
}

// usePlatform Hook
export function usePlatform(): Platform {
  const { platform } = useRuntime();
  return platform;
}

// useSystemInfo Hook
export function useSystemInfo(): SystemInfo | null {
  const { systemInfo } = useRuntime();
  return systemInfo;
}

// useNavigation Hook
export function useNavigation() {
  const { runtime } = useRuntime();
  
  return {
    navigateTo: runtime.navigateTo.bind(runtime),
    redirectTo: runtime.redirectTo.bind(runtime),
    switchTab: runtime.switchTab.bind(runtime),
    navigateBack: runtime.navigateBack.bind(runtime)
  };
}

// useStorage Hook
export function useStorage() {
  const { runtime } = useRuntime();
  
  return {
    setStorage: runtime.setStorage.bind(runtime),
    getStorage: runtime.getStorage.bind(runtime),
    removeStorage: runtime.removeStorage.bind(runtime),
    clearStorage: runtime.clearStorage.bind(runtime),
    setStorageSync: runtime.setStorageSync.bind(runtime),
    getStorageSync: runtime.getStorageSync.bind(runtime),
    removeStorageSync: runtime.removeStorageSync.bind(runtime),
    clearStorageSync: runtime.clearStorageSync.bind(runtime)
  };
}

// useRequest Hook
export function useRequest() {
  const { runtime } = useRuntime();
  
  return {
    request: runtime.request.bind(runtime)
  };
}

// useUI Hook
export function useUI() {
  const { runtime } = useRuntime();
  
  return {
    showToast: runtime.showToast.bind(runtime),
    showModal: runtime.showModal.bind(runtime),
    showLoading: runtime.showLoading.bind(runtime),
    hideLoading: runtime.hideLoading.bind(runtime)
  };
}

// useDevice Hook
export function useDevice() {
  const { runtime } = useRuntime();
  
  return {
    vibrateLong: runtime.vibrateLong.bind(runtime),
    vibrateShort: runtime.vibrateShort.bind(runtime),
    setClipboardData: runtime.setClipboardData.bind(runtime),
    getClipboardData: runtime.getClipboardData.bind(runtime),
    chooseImage: runtime.chooseImage.bind(runtime),
    getLocation: runtime.getLocation.bind(runtime)
  };
}

// usePlatformEffect Hook - 根据平台执行不同的副作用
export function usePlatformEffect(
  effects: Partial<Record<Platform, () => void | (() => void)>>,
  deps?: React.DependencyList
) {
  const { platform } = useRuntime();
  
  useEffect(() => {
    const effect = effects[platform];
    if (effect) {
      return effect();
    }
  }, [platform, ...(deps || [])]);
}

// useResponsive Hook - 响应式设计
export function useResponsive() {
  const { systemInfo } = useRuntime();
  const [windowSize, setWindowSize] = useState({
    width: systemInfo?.windowWidth || 0,
    height: systemInfo?.windowHeight || 0
  });

  useEffect(() => {
    if (systemInfo) {
      setWindowSize({
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight
      });
    }
  }, [systemInfo]);

  // 断点定义
  const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  };

  const getBreakpoint = () => {
    const width = windowSize.width;
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  return {
    windowSize,
    breakpoint: getBreakpoint(),
    isXs: windowSize.width < breakpoints.sm,
    isSm: windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.md,
    isMd: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isLg: windowSize.width >= breakpoints.lg && windowSize.width < breakpoints.xl,
    isXl: windowSize.width >= breakpoints.xl && windowSize.width < breakpoints.xxl,
    isXxl: windowSize.width >= breakpoints.xxl
  };
}

// useAsyncState Hook - 异步状态管理
export function useAsyncState<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    asyncFunction()
      .then(data => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}

// usePersistentState Hook - 持久化状态
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const { runtime } = useRuntime();
  const [state, setState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化时从存储中读取
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await runtime.getStorage(key);
        if (stored !== null) {
          setState(stored);
        }
      } catch (error) {
        console.warn(`Failed to load persistent state for key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadState();
  }, [key, runtime]);

  // 状态变化时保存到存储
  useEffect(() => {
    if (isLoaded) {
      runtime.setStorage(key, state).catch(error => {
        console.warn(`Failed to save persistent state for key "${key}":`, error);
      });
    }
  }, [key, state, runtime, isLoaded]);

  return [state, setState];
}

// useTheme Hook - 主题管理
export function useTheme() {
  const [theme, setTheme] = usePersistentState('app-theme', 'light');
  const { systemInfo } = useRuntime();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // 根据系统主题自动切换
  const setSystemTheme = () => {
    // 这里可以根据系统设置来判断主题
    // 不同平台的实现方式不同
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    setSystemTheme,
    isDark,
    isLight
  };
}