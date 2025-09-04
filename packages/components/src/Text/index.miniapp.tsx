import React, { forwardRef, ReactNode } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

// Text 组件属性接口
export interface TextProps {
  children?: ReactNode;
  style?: StyleObject;
  className?: string;
  onClick?: (event: any) => void;
  onLongPress?: (event: any) => void;
  // 文本属性
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  // 样式属性
  fontSize?: number | string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  fontFamily?: string;
  lineHeight?: number | string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  color?: string;
  backgroundColor?: string;
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
  // 其他属性
  opacity?: number;
  // 平台特定属性
  testID?: string; // React Native
  id?: string; // H5
  'data-testid'?: string; // H5 测试
}

// Text 组件实现 - 小程序版本
const Text = forwardRef<any, TextProps>((props, ref) => {
  const {
    children,
    style: customStyle,
    className,
    onClick,
    onLongPress,
    numberOfLines,
    ellipsizeMode = 'tail',
    selectable = true,
    // 样式属性
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
    lineHeight,
    textAlign,
    textDecorationLine,
    textTransform,
    color,
    backgroundColor,
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
    // 其他属性
    opacity,
    // 平台特定属性
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  // 构建样式对象
  const styleObject: StyleObject = {
    // 文本样式
    ...(fontSize !== undefined && { fontSize }),
    ...(fontWeight && { fontWeight }),
    ...(fontStyle && { fontStyle }),
    ...(fontFamily && { fontFamily }),
    ...(lineHeight !== undefined && { lineHeight }),
    ...(textAlign && { textAlign }),
    ...(textDecorationLine && { textDecorationLine }),
    ...(textTransform && { textTransform }),
    ...(color && { color }),
    ...(backgroundColor && { backgroundColor }),
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
    // 其他样式
    ...(opacity !== undefined && { opacity }),
    // 自定义样式
    ...customStyle
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: styleObject,
    weapp: {
      // 小程序特定样式
      display: 'inline-block',
      userSelect: selectable
    }
  });

  // 小程序特定属性
  const textProps: any = {
    ref,
    className: classNames('cross-text', className),
    style: styles,
    onClick,
    onLongPress,
    selectable,
    ...restProps
  };

  // 小程序文本截断
  if (numberOfLines && numberOfLines > 0) {
    textProps.maxLines = numberOfLines;
  }

  return React.createElement(
    'text',
    textProps,
    children
  );
});

Text.displayName = 'Text';

// 预设文本样式组件
export const Heading1 = forwardRef<any, Omit<TextProps, 'fontSize' | 'fontWeight'>>((props, ref) => (
  <Text ref={ref} fontSize={24} fontWeight="bold" {...props} />
));

export const Heading2 = forwardRef<any, Omit<TextProps, 'fontSize' | 'fontWeight'>>((props, ref) => (
  <Text ref={ref} fontSize={20} fontWeight="bold" {...props} />
));

export const Heading3 = forwardRef<any, Omit<TextProps, 'fontSize' | 'fontWeight'>>((props, ref) => (
  <Text ref={ref} fontSize={18} fontWeight="bold" {...props} />
));

export const Heading4 = forwardRef<any, Omit<TextProps, 'fontSize' | 'fontWeight'>>((props, ref) => (
  <Text ref={ref} fontSize={16} fontWeight="bold" {...props} />
));

export const Paragraph = forwardRef<any, Omit<TextProps, 'fontSize' | 'lineHeight'>>((props, ref) => (
  <Text ref={ref} fontSize={14} lineHeight={1.5} {...props} />
));

export const Caption = forwardRef<any, Omit<TextProps, 'fontSize' | 'color'>>((props, ref) => (
  <Text ref={ref} fontSize={12} color="#666" {...props} />
));

export const Link = forwardRef<any, Omit<TextProps, 'color' | 'textDecorationLine'>>((props, ref) => (
  <Text ref={ref} color="#1890ff" textDecorationLine="underline" {...props} />
));

// 设置显示名称
Heading1.displayName = 'Heading1';
Heading2.displayName = 'Heading2';
Heading3.displayName = 'Heading3';
Heading4.displayName = 'Heading4';
Paragraph.displayName = 'Paragraph';
Caption.displayName = 'Caption';
Link.displayName = 'Link';

export default Text;
