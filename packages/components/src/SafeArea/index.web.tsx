import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import { useSystemInfo, createStyles, StyleObject } from '@cross-platform/core';
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
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// SafeArea 组件实现 - Web 版本
const SafeArea = forwardRef<any, SafeAreaProps>((props, ref) => {
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
      return getH5SafeAreaInsets();
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
    }
  });

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
});

SafeArea.displayName = 'SafeArea';

// 导出 Hook 用于获取安全区域信息
export const useSafeAreaInsets = (): SafeAreaInsets => {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
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
        const safeAreaInsets = {
          top: parseInt(computedStyle.paddingTop, 10) || 0,
          bottom: parseInt(computedStyle.paddingBottom, 10) || 0,
          left: parseInt(computedStyle.paddingLeft, 10) || 0,
          right: parseInt(computedStyle.paddingRight, 10) || 0
        };

        document.body.removeChild(testElement);
        setInsets(safeAreaInsets);
      } else {
        // 降级方案：根据 User Agent 判断
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isIPhoneX = isIOS && window.screen.height >= 812;

        if (isIPhoneX) {
          setInsets({
            top: 44, // 状态栏 + 刘海
            bottom: 34, // Home indicator
            left: 0,
            right: 0
          });
        }
      }
    }
  }, []);

  return insets;
};

export default SafeArea;
