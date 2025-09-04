import React, { forwardRef, ReactNode } from 'react';
import { usePlatform, createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

// View 组件属性接口
export interface ViewProps {
  children?: ReactNode;
  style?: StyleObject;
  className?: string;
  onClick?: (event: any) => void;
  onLongPress?: (event: any) => void;
  onTouchStart?: (event: any) => void;
  onTouchMove?: (event: any) => void;
  onTouchEnd?: (event: any) => void;
  // 布局属性
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  // 尺寸属性
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  // 间距属性
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  // 定位属性
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  // 背景和边框
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  // 其他属性
  opacity?: number;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  // 平台特定属性
  testID?: string; // React Native
  id?: string; // H5
  'data-testid'?: string; // H5 测试
}

// View 组件实现
export const View = forwardRef<any, ViewProps>((props, ref) => {
  const {
    children,
    style: customStyle,
    className,
    onClick,
    onLongPress,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    // 布局属性
    flex,
    flexDirection,
    justifyContent,
    alignItems,
    alignSelf,
    flexWrap,
    // 尺寸属性
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    // 间距属性
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    // 定位属性
    position,
    top,
    right,
    bottom,
    left,
    zIndex,
    // 背景和边框
    backgroundColor,
    borderWidth,
    borderColor,
    borderRadius,
    borderStyle,
    // 其他属性
    opacity,
    overflow,
    // 平台特定属性
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  const platform = usePlatform();

  // 构建样式对象
  const styleObject: StyleObject = {
    // 布局样式
    ...(flex !== undefined && { flex }),
    ...(flexDirection && { flexDirection }),
    ...(justifyContent && { justifyContent }),
    ...(alignItems && { alignItems }),
    ...(alignSelf && { alignSelf }),
    ...(flexWrap && { flexWrap }),
    // 尺寸样式
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(minWidth !== undefined && { minWidth }),
    ...(minHeight !== undefined && { minHeight }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(maxHeight !== undefined && { maxHeight }),
    // 间距样式
    ...(margin !== undefined && { margin }),
    ...(marginTop !== undefined && { marginTop }),
    ...(marginRight !== undefined && { marginRight }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginLeft !== undefined && { marginLeft }),
    ...(padding !== undefined && { padding }),
    ...(paddingTop !== undefined && { paddingTop }),
    ...(paddingRight !== undefined && { paddingRight }),
    ...(paddingBottom !== undefined && { paddingBottom }),
    ...(paddingLeft !== undefined && { paddingLeft }),
    // 定位样式
    ...(position && { position }),
    ...(top !== undefined && { top }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    ...(zIndex !== undefined && { zIndex }),
    // 背景和边框样式
    ...(backgroundColor && { backgroundColor }),
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderColor && { borderColor }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(borderStyle && { borderStyle }),
    // 其他样式
    ...(opacity !== undefined && { opacity }),
    ...(overflow && { overflow }),
    // 自定义样式
    ...customStyle
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: styleObject,
    h5: {
      // H5 特定样式
      display: 'block',
      boxSizing: 'border-box'
    },
    rn: {
      // React Native 特定样式
      // RN 默认就是 flex 布局
    },
    weapp: {
      // 小程序特定样式
      display: 'block',
      boxSizing: 'border-box'
    }
  });

  // 事件处理
  const handleClick = (event: any) => {
    onClick?.(event);
  };

  const handleLongPress = (event: any) => {
    if (platform === 'h5') {
      // H5 模拟长按
      let timer: NodeJS.Timeout;
      const startLongPress = () => {
        timer = setTimeout(() => {
          onLongPress?.(event);
        }, 500);
      };
      const cancelLongPress = () => {
        clearTimeout(timer);
      };
      
      event.target.addEventListener('mousedown', startLongPress);
      event.target.addEventListener('mouseup', cancelLongPress);
      event.target.addEventListener('mouseleave', cancelLongPress);
    } else {
      onLongPress?.(event);
    }
  };

  // 平台特定渲染
  switch (platform) {
    case 'h5':
      return (
        <div
          ref={ref}
          className={classNames('cross-view', className)}
          style={styles}
          onClick={handleClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          id={id}
          data-testid={dataTestId}
          {...restProps}
        >
          {children}
        </div>
      );

    case 'rn':
      // React Native 渲染
      const { View: RNView } = require('react-native');
      return (
        <RNView
          ref={ref}
          style={styles}
          onPress={handleClick}
          onLongPress={onLongPress}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          testID={testID}
          {...restProps}
        >
          {children}
        </RNView>
      );

    case 'weapp':
    case 'alipay':
    case 'tt':
      // 小程序渲染
      return (
        <view
          ref={ref}
          className={classNames('cross-view', className)}
          style={styles}
          onClick={handleClick}
          onLongPress={onLongPress}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          {...restProps}
        >
          {children}
        </view>
      );

    default:
      // 默认渲染（H5）
      return (
        <div
          ref={ref}
          className={classNames('cross-view', className)}
          style={styles}
          onClick={handleClick}
          {...restProps}
        >
          {children}
        </div>
      );
  }
});

View.displayName = 'View';

// 默认样式
const defaultStyles = createStyles({
  view: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 0,
    minWidth: 0
  }
});

export default View;