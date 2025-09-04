import React, { forwardRef } from 'react';
import { StyleObject } from '@cross-platform/core';
import { View as RNView, Text as RNText } from 'react-native';

// Divider 组件属性接口
export interface DividerProps {
  style?: StyleObject;
  className?: string;
  children?: React.ReactNode;
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'center' | 'right';
  orientationMargin?: number | string;
  dashed?: boolean;
  color?: string;
  thickness?: number;
  margin?: number | string;
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// Divider 组件实现 - React Native 版本
const Divider = forwardRef<any, DividerProps>((props, ref) => {
  const {
    style,
    className,
    children,
    type = 'horizontal',
    orientation = 'center',
    orientationMargin,
    dashed = false,
    color = '#f0f0f0',
    thickness = 1,
    margin = type === 'horizontal' ? '24px 0' : '0 8px',
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  const hasContent = !!children;

  // 构建样式对象
  const dividerStyle = {
    // 基础样式
    ...(type === 'horizontal' ? {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      margin: margin,
      ...(hasContent ? {} : { borderBottomWidth: thickness, borderBottomColor: color, borderBottomStyle: dashed ? 'dashed' : 'solid' })
    } : {
      height: '1em',
      margin: margin,
      borderLeftWidth: thickness,
      borderLeftColor: color,
      borderLeftStyle: dashed ? 'dashed' : 'solid',
      alignSelf: 'stretch'
    }),
    ...(style || {})
  };

  // 文本样式
  const textContainerStyle = {
    padding: '0 16px',
    fontWeight: 500,
    fontSize: 14,
    color: '#666',
    ...(orientation === 'left' && {
      marginRight: 'auto',
      ...(orientationMargin != null && { marginLeft: orientationMargin })
    }),
    ...(orientation === 'right' && {
      marginLeft: 'auto',
      ...(orientationMargin != null && { marginRight: orientationMargin })
    })
  };

  // 线条样式
  const lineStyle = {
    flex: 1,
    borderBottomWidth: thickness,
    borderBottomColor: color,
    borderBottomStyle: dashed ? 'dashed' : 'solid'
  };

  // React Native 渲染
  if (type === 'horizontal' && hasContent) {
    return (
      <RNView
        ref={ref}
        style={dividerStyle}
        testID={testID}
        {...restProps}
      >
        {orientation !== 'right' && <RNView style={lineStyle} />}
        <RNView style={textContainerStyle}>
          {typeof children === 'string' ? (
            <RNText style={{ color: '#666', fontWeight: '500' }}>{children}</RNText>
          ) : (
            children
          )}
        </RNView>
        {orientation !== 'left' && <RNView style={lineStyle} />}
      </RNView>
    );
  }

  return (
    <RNView
      ref={ref}
      style={dividerStyle}
      testID={testID}
      {...restProps}
    />
  );
});

Divider.displayName = 'Divider';

export default Divider;