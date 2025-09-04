import React, { forwardRef, useState } from 'react';
import { StyleObject } from '@cross-platform/core';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

// TouchableOpacity 组件属性接口
export interface TouchableOpacityProps {
  children?: React.ReactNode;
  style?: StyleObject;
  className?: string;
  activeOpacity?: number;
  disabled?: boolean;
  onPress?: (event: any) => void;
  onLongPress?: (event: any) => void;
  onPressIn?: (event: any) => void;
  onPressOut?: (event: any) => void;
  delayLongPress?: number;
  hitSlop?: { top?: number; left?: number; bottom?: number; right?: number };
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// TouchableOpacity 组件实现 - React Native 版本
const TouchableOpacity = forwardRef<any, TouchableOpacityProps>((props, ref) => {
  const {
    children,
    style,
    className,
    activeOpacity = 0.2,
    disabled = false,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    delayLongPress = 500,
    hitSlop,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  // 构建样式对象
  const touchableStyle = {
    // 基础样式
    ...(style || {})
  };

  return (
    <RNTouchableOpacity
      ref={ref}
      style={touchableStyle}
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      delayLongPress={delayLongPress}
      hitSlop={hitSlop}
      testID={testID}
      {...restProps}
    >
      {children}
    </RNTouchableOpacity>
  );
});

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;