import { useState, useEffect } from 'react';

export interface PlatformInfo {
  isWeb: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
  platform: string;
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    if (typeof window === 'undefined') {
      // SSR 环境
      return {
        isWeb: true,
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        isDesktop: true,
        userAgent: '',
        platform: 'unknown',
      };
    }

    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /Mobile/.test(userAgent);
    
    return {
      isWeb: true,
      isIOS,
      isAndroid,
      isMobile,
      isDesktop: !isMobile,
      userAgent,
      platform,
    };
  });

  useEffect(() => {
    // 监听屏幕尺寸变化来更新移动端状态
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setPlatformInfo(prev => ({
        ...prev,
        isMobile,
        isDesktop: !isMobile,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return platformInfo;
};

export default usePlatform;