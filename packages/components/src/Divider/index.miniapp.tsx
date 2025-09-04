import React, { forwardRef } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';
import Text from '../Text';

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

// Divider 组件实现 - 小程序版本
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
  const dividerStyle: StyleObject = {
    // 基础样式
    ...(type === 'horizontal' ? {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      margin: margin,
      ...(hasContent ? {} : { borderBottomWidth: thickness, borderBottomColor: color, borderBottomStyle: dashed ? 'dashed' : 'solid' })
    } : {
      display: 'inline-block',
      height: '1em',
      margin: margin,
      borderLeftWidth: thickness,
      borderLeftColor: color,
      borderLeftStyle: dashed ? 'dashed' : 'solid',
      verticalAlign: 'middle'
    }),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: dividerStyle,
    weapp: {
      // 小程序特定样式
    }
  });

  // 文本样式
  const textContainerStyle: StyleObject = {
    padding: '0 16px',
    whiteSpace: 'nowrap',
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
  const lineStyle: StyleObject = {
    flex: 1,
    borderBottomWidth: thickness,
    borderBottomColor: color,
    borderBottomStyle: dashed ? 'dashed' : 'solid'
  };

  // 小程序渲染
  if (type === 'horizontal' && hasContent) {
    return React.createElement(
      'view',
      {
        ref,
        className: classNames('cross-divider', 'cross-divider-horizontal', className),
        style: styles,
        ...restProps
      },
      [
        orientation !== 'right' && React.createElement(
          'view',
          {
            key: 'left-line',
            style: lineStyle,
            className: "cross-divider-line cross-divider-line-left"
          }
        ),
        React.createElement(
          'view',
          {
            key: 'text',
            style: textContainerStyle,
            className: "cross-divider-text"
          },
          children
        ),
        orientation !== 'left' && React.createElement(
          'view',
          {
            key: 'right-line',
            style: lineStyle,
            className: "cross-divider-line cross-divider-line-right"
          }
        )
      ].filter(Boolean)
    );
  }

  return React.createElement(
    'view',
    {
      ref,
      className: classNames(
        'cross-divider',
        type === 'horizontal' ? 'cross-divider-horizontal' : 'cross-divider-vertical',
        className
      ),
      style: styles,
      ...restProps
    }
  );
});

Divider.displayName = 'Divider';

export default Divider;
