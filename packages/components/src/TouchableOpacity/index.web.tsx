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

// TouchableOpacity 组件实现 - Web 版本
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
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let isLongPressTriggered = false;

  // 构建样式对象
  const touchableStyle: StyleObject = {
    // 基础样式
    cursor: disabled ? 'default' : 'pointer',
    opacity: isPressed && !disabled ? activeOpacity : 1,
    transition: 'opacity 0.2s ease',
    userSelect: 'none',
    ...(disabled && { opacity: 0.5 }),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: touchableStyle,
    h5: {
      // H5 特定样式
      outline: 'none',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      ...(hitSlop && {
        padding: `${hitSlop.top || 0}px ${hitSlop.right || 0}px ${hitSlop.bottom || 0}px ${hitSlop.left || 0}px`,
        margin: `-${hitSlop.top || 0}px -${hitSlop.right || 0}px -${hitSlop.bottom || 0}px -${hitSlop.left || 0}px`
      })
    }
  });

  // 事件处理
  const handlePressIn = (event: any) => {
    if (disabled) return;

    setIsPressed(true);
    onPressIn?.(event);

    if (onLongPress) {
      isLongPressTriggered = false;
      longPressTimer = setTimeout(() => {
        isLongPressTriggered = true;
        onLongPress(event);
      }, delayLongPress);
    }
  };

  const handlePressOut = (event: any) => {
    if (disabled) return;

    setIsPressed(false);
    onPressOut?.(event);

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const handlePress = (event: any) => {
    if (disabled) return;

    // 如果长按已触发，不触发点击事件
    if (!isLongPressTriggered && onPress) {
      onPress(event);
    }
  };

  return (
    <div
      ref={ref}
      className={classNames('cross-touchable-opacity', className)}
      style={styles}
      onClick={handlePress}
      onMouseDown={handlePressIn}
      onMouseUp={handlePressOut}
      onMouseLeave={handlePressOut}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
      id={id}
      data-testid={dataTestId || testID}
      {...restProps}
    >
      {children}
    </div>
  );
});

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;
