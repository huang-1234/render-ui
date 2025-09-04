import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import { usePlatform, useSystemInfo, createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';

// SafeArea 组件属性接口
export interface SafeAreaProps {
  children?: ReactNode;
  style?: StyleObject;
  className?: string;
  // 安全区域配置
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  // 强制设置安全区域值
  forceInsets?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  // 最小安全区域值
  minInsets?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  // 背景色
  backgroundColor?: string;
  // 其他属性
  testID?: string;
  id?: string;
  'data-testid'?: string;
}

// 安全区域信息接口
interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// SafeArea 组件实现
export const SafeArea = forwardRef<any, SafeAreaProps>((props, ref) => {
  const {
    children,
    style: customStyle,
    className,
    top = false,
    bottom = false,
    left = false,
    right = false,
    forceInsets,
    minInsets,
    backgroundColor,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  const platform = usePlatform();
  const systemInfo = useSystemInfo();
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  // 获取安全区域信息
  useEffect(() => {
    const getSafeAreaInsets = async (): Promise<SafeAreaInsets> => {
      switch (platform) {
        case 'h5':
          return getH5SafeAreaInsets();
        case 'rn':
          return getRNSafeAreaInsets();
        case 'weapp':
          return getWeappSafeAreaInsets();
        case 'alipay':
          return getAlipaySafeAreaInsets();
        case 'tt':
          return getTTSafeAreaInsets();
        default:
          return { top: 0, bottom: 0, left: 0, right: 0 };
      }
    };

    getSafeAreaInsets().then(insets => {
      // 应用强制设置的值
      if (forceInsets) {
        Object.keys(forceInsets).forEach(key => {
          const value = forceInsets[key as keyof SafeAreaInsets];
          if (value !== undefined) {
            insets[key as keyof SafeAreaInsets] = value;
          }
        });
      }

      // 应用最小值限制
      if (minInsets) {
        Object.keys(minInsets).forEach(key => {
          const minValue = minInsets[key as keyof SafeAreaInsets];
          if (minValue !== undefined) {
            const currentValue = insets[key as keyof SafeAreaInsets];
            insets[key as keyof SafeAreaInsets] = Math.max(currentValue, minValue);
          }
        });
      }

      setSafeAreaInsets(insets);
    });
  }, [platform, systemInfo, forceInsets, minInsets]);

  // H5 安全区域获取
  const getH5SafeAreaInsets = (): SafeAreaInsets => {
    // 检查是否支持 CSS env() 函数
    if (typeof window !== 'undefined' && window.CSS && window.CSS.supports) {
      const supportsEnv = window.CSS.supports('padding-top', 'env(safe-area-inset-top)');
      
      if (supportsEnv) {
        // 创建临时元素来获取安全区域值
        const testElement = document.createElement('div');
        testElement.style.position = 'fixed';
        testElement.style.top = '0';
        testElement.style.left = '0';
        testElement.style.width = '1px';
        testElement.style.height = '1px';
        testElement.style.visibility = 'hidden';
        testElement.style.paddingTop = 'env(safe-area-inset-top, 0px)';
        testElement.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
        testElement.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
        testElement.style.paddingRight = 'env(safe-area-inset-right, 0px)';
        
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const insets = {
          top: parseInt(computedStyle.paddingTop, 10) || 0,
          bottom: parseInt(computedStyle.paddingBottom, 10) || 0,
          left: parseInt(computedStyle.paddingLeft, 10) || 0,
          right: parseInt(computedStyle.paddingRight, 10) || 0
        };
        
        document.body.removeChild(testElement);
        return insets;
      }
    }

    // 降级方案：根据 User Agent 判断
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isIPhoneX = isIOS && window.screen.height >= 812;
    
    if (isIPhoneX) {
      return {
        top: 44, // 状态栏 + 刘海
        bottom: 34, // Home indicator
        left: 0,
        right: 0
      };
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  };

  // React Native 安全区域获取
  const getRNSafeAreaInsets = (): SafeAreaInsets => {
    try {
      // 尝试使用 react-native-safe-area-context
      const { useSafeAreaInsets } = require('react-native-safe-area-context');
      const insets = useSafeAreaInsets();
      return insets;
    } catch (error) {
      // 降级方案：使用系统信息
      if (systemInfo && systemInfo.safeArea) {
        return systemInfo.safeArea;
      }
      
      // 默认值
      const { Platform, Dimensions } = require('react-native');
      const { height } = Dimensions.get('window');
      
      if (Platform.OS === 'ios') {
        // iPhone X 系列判断
        const isIPhoneX = height >= 812;
        return {
          top: isIPhoneX ? 44 : 20,
          bottom: isIPhoneX ? 34 : 0,
          left: 0,
          right: 0
        };
      } else {
        // Android
        return {
          top: 24, // 状态栏高度
          bottom: 0,
          left: 0,
          right: 0
        };
      }
    }
  };

  // 微信小程序安全区域获取
  const getWeappSafeAreaInsets = (): SafeAreaInsets => {
    if (systemInfo && systemInfo.safeArea) {
      const { safeArea, screenHeight, screenWidth } = systemInfo;
      return {
        top: safeArea.top,
        bottom: screenHeight - safeArea.bottom,
        left: safeArea.left,
        right: screenWidth - safeArea.right
      };
    }

    // 降级方案
    try {
      const wx = (global as any).wx;
      const systemInfo = wx.getSystemInfoSync();
      const { safeArea, screenHeight, screenWidth } = systemInfo;
      
      if (safeArea) {
        return {
          top: safeArea.top,
          bottom: screenHeight - safeArea.bottom,
          left: safeArea.left,
          right: screenWidth - safeArea.right
        };
      }
    } catch (error) {
      console.warn('Failed to get WeChat safe area:', error);
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  };

  // 支付宝小程序安全区域获取
  const getAlipaySafeAreaInsets = (): SafeAreaInsets => {
    try {
      const my = (global as any).my;
      const systemInfo = my.getSystemInfoSync();
      
      // 支付宝小程序的安全区域处理
      if (systemInfo.safeArea) {
        const { safeArea, screenHeight, screenWidth } = systemInfo;
        return {
          top: safeArea.top,
          bottom: screenHeight - safeArea.bottom,
          left: safeArea.left,
          right: screenWidth - safeArea.right
        };
      }
    } catch (error) {
      console.warn('Failed to get Alipay safe area:', error);
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  };

  // 抖音小程序安全区域获取
  const getTTSafeAreaInsets = (): SafeAreaInsets => {
    try {
      const tt = (global as any).tt;
      const systemInfo = tt.getSystemInfoSync();
      
      if (systemInfo.safeArea) {
        const { safeArea, screenHeight, screenWidth } = systemInfo;
        return {
          top: safeArea.top,
          bottom: screenHeight - safeArea.bottom,
          left: safeArea.left,
          right: screenWidth - safeArea.right
        };
      }
    } catch (error) {
      console.warn('Failed to get TikTok safe area:', error);
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  };

  // 构建样式对象
  const styleObject: StyleObject = {
    flex: 1,
    ...(backgroundColor && { backgroundColor }),
    // 应用安全区域内边距
    ...(top && { paddingTop: safeAreaInsets.top }),
    ...(bottom && { paddingBottom: safeAreaInsets.bottom }),
    ...(left && { paddingLeft: safeAreaInsets.left }),
    ...(right && { paddingRight: safeAreaInsets.right }),
    // 自定义样式
    ...customStyle
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: styleObject,
    h5: {
      // H5 特定样式
      minHeight: '100vh',
      // 使用 CSS env() 作为备选方案
      ...(top && {
        paddingTop: `max(${safeAreaInsets.top}px, env(safe-area-inset-top, 0px))`
      }),
      ...(bottom && {
        paddingBottom: `max(${safeAreaInsets.bottom}px, env(safe-area-inset-bottom, 0px))`
      }),
      ...(left && {
        paddingLeft: `max(${safeAreaInsets.left}px, env(safe-area-inset-left, 0px))`
      }),
      ...(right && {
        paddingRight: `max(${safeAreaInsets.right}px, env(safe-area-inset-right, 0px))`
      })
    },
    rn: {
      // React Native 特定样式
      // 在 RN 中，SafeAreaView 组件会自动处理
    },
    weapp: {
      // 小程序特定样式
      minHeight: '100vh'
    }
  });

  // 平台特定渲染
  switch (platform) {
    case 'rn':
      // React Native 使用 SafeAreaView
      try {
        const { SafeAreaView } = require('react-native-safe-area-context');
        return (
          <SafeAreaView
            ref={ref}
            style={styles}
            edges={[
              ...(top ? ['top'] : []),
              ...(bottom ? ['bottom'] : []),
              ...(left ? ['left'] : []),
              ...(right ? ['right'] : [])
            ]}
            testID={testID}
            {...restProps}
          >
            {children}
          </SafeAreaView>
        );
      } catch (error) {
        // 降级到普通 View
        return (
          <View
            ref={ref}
            style={styles}
            testID={testID}
            {...restProps}
          >
            {children}
          </View>
        );
      }

    default:
      // 其他平台使用 View
      return (
        <View
          ref={ref}
          style={styles}
          className={classNames('cross-safe-area', className)}
          id={id}
          data-testid={dataTestId}
          {...restProps}
        >
          {children}
        </View>
      );
  }
});

SafeArea.displayName = 'SafeArea';

// 导出 Hook 用于获取安全区域信息
export const useSafeAreaInsets = (): SafeAreaInsets => {
  const platform = usePlatform();
  const systemInfo = useSystemInfo();
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    // 这里可以复用 SafeArea 组件中的逻辑
    // 为了简化，这里只返回基本值
    if (systemInfo && systemInfo.safeArea) {
      setInsets(systemInfo.safeArea);
    }
  }, [platform, systemInfo]);

  return insets;
};

export default SafeArea;