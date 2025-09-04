import React, { forwardRef, useState } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

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

// TouchableOpacity 组件实现 - 小程序版本
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

  const [isPressed, setIsPressed] = useState(false);

  // 构建样式对象
  const touchableStyle: StyleObject = {
    // 基础样式
    opacity: isPressed && !disabled ? activeOpacity : 1,
    ...(disabled && { opacity: 0.5 }),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: touchableStyle,
    weapp: {
      // 小程序特定样式
    }
  });

  // 事件处理
  const handlePress = (event: any) => {
    if (disabled) return;
    onPress?.(event);
  };

  const handlePressIn = (event: any) => {
    if (!disabled) {
      setIsPressed(true);
      onPressIn?.(event);
    }
  };

  const handlePressOut = (event: any) => {
    setIsPressed(false);
    onPressOut?.(event);
  };

  const handleLongPress = (event: any) => {
    if (!disabled) {
      onLongPress?.(event);
    }
  };

  // 小程序特定属性
  const touchableProps = {
    className: classNames('cross-touchable-opacity', className, {
      'cross-touchable-opacity-disabled': disabled
    }),
    style: styles,
    hoverClass: !disabled ? 'cross-touchable-opacity-active' : '',
    hoverStartTime: 0,
    hoverStayTime: 0,
    onTap: !disabled ? handlePress : undefined,
    onLongPress: !disabled && onLongPress ? onLongPress : undefined,
    onTouchStart: !disabled ? handlePressIn : undefined,
    onTouchEnd: !disabled ? handlePressOut : undefined,
    onTouchCancel: !disabled ? handlePressOut : undefined,
    ...restProps
  };

  return React.createElement(
    'view',
    {
      ref,
      ...touchableProps
    },
    children
  );
});

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;
