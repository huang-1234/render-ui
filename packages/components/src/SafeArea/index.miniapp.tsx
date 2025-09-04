import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import { useSystemInfo, createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';
import { ScrollView } from '@cross-platform/mini-program-renderer';

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
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
export interface RefSafeArea {
  scrollViewRef: React.RefObject<ScrollView>;
  safeAreaViewRef: React.RefObject<typeof View>;
}

// SafeArea 组件实现 - 小程序版本
const SafeArea = forwardRef<RefSafeArea, SafeAreaProps>((props, ref) => {
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
      return getMiniappSafeAreaInsets();
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
  }, [systemInfo, forceInsets, minInsets]);

  // 小程序安全区域获取
  const getMiniappSafeAreaInsets = (): SafeAreaInsets => {
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
      // 尝试获取全局小程序对象
      const miniappGlobal = (global as any).wx || (global as any).my || (global as any).tt;
      if (miniappGlobal) {
        const systemInfoSync = miniappGlobal.getSystemInfoSync();
        const { safeArea, screenHeight, screenWidth } = systemInfoSync;

        if (safeArea) {
          return {
            top: safeArea.top,
            bottom: screenHeight - safeArea.bottom,
            left: safeArea.left,
            right: screenWidth - safeArea.right
          };
        }
      }
    } catch (error) {
      console.warn('Failed to get miniapp safe area:', error);
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
    weapp: {
      // 小程序特定样式
      minHeight: '100vh'
    }
  });

  // 小程序特定属性
  const viewProps = {
    className: classNames('cross-safe-area', className),
    style: styles,
    ...restProps
  };

  return React.createElement(
    'view',
    {
      ref,
      ...viewProps
    },
    children
  );
});

SafeArea.displayName = 'SafeArea';

// 导出 Hook 用于获取安全区域信息
export const useSafeAreaInsets = (): SafeAreaInsets => {
  const systemInfo = useSystemInfo();
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    if (systemInfo && systemInfo.safeArea) {
      const { safeArea, screenHeight, screenWidth } = systemInfo;
      setInsets({
        top: safeArea.top,
        bottom: screenHeight - safeArea.bottom,
        left: safeArea.left,
        right: screenWidth - safeArea.right
      });
    }
  }, [systemInfo]);

  return insets;
};

export default SafeArea;
