import React, { forwardRef } from 'react';
import { StyleObject } from '@cross-platform/core';
import { View as RNView, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import Text from '../Text';
import View from '../View';

// Card 组件属性接口
export interface CardProps {
  children?: React.ReactNode;
  style?: StyleObject;
  className?: string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  headerStyle?: StyleObject;
  bodyStyle?: StyleObject;
  footerStyle?: StyleObject;
  footer?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  shadow?: boolean | 'sm' | 'md' | 'lg';
  radius?: number | 'sm' | 'md' | 'lg' | 'none';
  onPress?: (event: any) => void;
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// Card 组件实现 - React Native 版本
const Card = forwardRef<any, CardProps>((props, ref) => {
  const {
    children,
    style,
    className,
    title,
    extra,
    headerStyle,
    bodyStyle,
    footerStyle,
    footer,
    bordered = true,
    hoverable = false,
    shadow = false,
    radius = 'md',
    onPress,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  // 获取圆角尺寸
  const getBorderRadius = () => {
    if (typeof radius === 'number') return radius;

    switch (radius) {
      case 'sm': return 4;
      case 'md': return 8;
      case 'lg': return 12;
      case 'none': return 0;
      default: return 8;
    }
  };

  // 获取阴影样式
  const getShadowStyle = () => {
    if (!shadow) return {};

    if (shadow === true || shadow === 'md') {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4
      };
    } else if (shadow === 'sm') {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      };
    } else if (shadow === 'lg') {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8
      };
    }

    return {};
  };

  // 构建样式对象
  const cardStyle = {
    // 基础样式
    backgroundColor: '#ffffff',
    borderRadius: getBorderRadius(),
    overflow: 'hidden',
    ...(bordered && { borderWidth: 1, borderColor: '#f0f0f0', borderStyle: 'solid' }),
    ...getShadowStyle(),
    ...(style || {})
  };

  const headerDefaultStyle = {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: bordered ? 1 : 0,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
    ...(headerStyle || {})
  };

  const bodyDefaultStyle = {
    padding: 16,
    ...(bodyStyle || {})
  };

  const footerDefaultStyle = {
    padding: 16,
    borderTopWidth: bordered ? 1 : 0,
    borderTopColor: '#f0f0f0',
    borderTopStyle: 'solid',
    ...(footerStyle || {})
  };

  // 渲染标题
  const renderHeader = () => {
    if (!title && !extra) return null;

    return (
      <View style={headerDefaultStyle} className="cross-card-header">
        {typeof title === 'string' ? (
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
        ) : (
          title
        )}
        {extra && <View className="cross-card-extra">{extra}</View>}
      </View>
    );
  };

  // 渲染内容
  const renderBody = () => (
    <View style={bodyDefaultStyle} className="cross-card-body">
      {children}
    </View>
  );

  // 渲染底部
  const renderFooter = () => {
    if (!footer) return null;

    return (
      <View style={footerDefaultStyle} className="cross-card-footer">
        {footer}
      </View>
    );
  };

  // 渲染卡片内容
  const renderCardContent = () => (
    <>
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </>
  );

  // React Native 渲染
  if (onPress) {
    return (
      <RNTouchableOpacity
        ref={ref}
        style={cardStyle}
        onPress={onPress}
        testID={testID}
        activeOpacity={0.7}
        {...restProps}
      >
        {renderCardContent()}
      </RNTouchableOpacity>
    );
  }

  return (
    <RNView
      ref={ref}
      style={cardStyle}
      testID={testID}
      {...restProps}
    >
      {renderCardContent()}
    </RNView>
  );
});

Card.displayName = 'Card';

export default Card;