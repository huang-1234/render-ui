import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import { StyleObject } from '@cross-platform/core';
import { View } from 'react-native';

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

// SafeArea 组件实现 - React Native 版本
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

  // React Native 使用 SafeAreaView
  try {
    const { SafeAreaView } = require('react-native-safe-area-context');
    return (
      <SafeAreaView
        ref={ref}
        style={{
          flex: 1,
          ...(backgroundColor && { backgroundColor }),
          ...customStyle
        }}
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
        style={{
          flex: 1,
          ...(backgroundColor && { backgroundColor }),
          // 应用安全区域内边距
          ...(top && { paddingTop: 20 }), // 默认状态栏高度
          ...(bottom && { paddingBottom: 0 }),
          ...(left && { paddingLeft: 0 }),
          ...(right && { paddingRight: 0 }),
          ...customStyle
        }}
        testID={testID}
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
  try {
    const { useSafeAreaInsets: useRNSafeAreaInsets } = require('react-native-safe-area-context');
    return useRNSafeAreaInsets();
  } catch (error) {
    // 降级到默认值
    return {
      top: 20, // 默认状态栏高度
      bottom: 0,
      left: 0,
      right: 0
    };
  }
};

export default SafeArea;