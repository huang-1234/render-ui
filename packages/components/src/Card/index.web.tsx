import React, { forwardRef } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';
import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';

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

// Card 组件实现 - Web 版本
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
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      };
    } else if (shadow === 'sm') {
      return {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
      };
    } else if (shadow === 'lg') {
      return {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
      };
    }

    return {};
  };

  // 构建样式对象
  const cardStyle: StyleObject = {
    // 基础样式
    backgroundColor: '#ffffff',
    borderRadius: getBorderRadius(),
    overflow: 'hidden',
    ...(bordered && { borderWidth: 1, borderColor: '#f0f0f0', borderStyle: 'solid' }),
    ...(hoverable && { cursor: 'pointer' }),
    ...getShadowStyle(),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: cardStyle,
    h5: {
      // H5 特定样式
      transition: 'all 0.3s',
      ...(hoverable && {
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        }
      })
    }
  });

  const headerDefaultStyle: StyleObject = {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: bordered ? 1 : 0,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid'
  };

  const bodyDefaultStyle: StyleObject = {
    padding: 16
  };

  const footerDefaultStyle: StyleObject = {
    padding: 16,
    borderTopWidth: bordered ? 1 : 0,
    borderTopColor: '#f0f0f0',
    borderTopStyle: 'solid'
  };

  const headerStyles = createStyles({
    default: { ...headerDefaultStyle, ...headerStyle }
  });

  const bodyStyles = createStyles({
    default: { ...bodyDefaultStyle, ...bodyStyle }
  });

  const footerStyles = createStyles({
    default: { ...footerDefaultStyle, ...footerStyle }
  });

  // 渲染标题
  const renderHeader = () => {
    if (!title && !extra) return null;

    return (
      <View style={headerStyles} className="cross-card-header">
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
    <View style={bodyStyles} className="cross-card-body">
      {children}
    </View>
  );

  // 渲染底部
  const renderFooter = () => {
    if (!footer) return null;

    return (
      <View style={footerStyles} className="cross-card-footer">
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

  // Web 渲染
  if (onPress) {
    return (
      <TouchableOpacity
        ref={ref}
        style={styles}
        className={classNames('cross-card', className)}
        onPress={onPress}
        id={id}
        data-testid={dataTestId || testID}
        {...restProps}
      >
        {renderCardContent()}
      </TouchableOpacity>
    );
  }

  return (
    <div
      ref={ref}
      className={classNames('cross-card', className)}
      style={styles}
      id={id}
      data-testid={dataTestId || testID}
      {...restProps}
    >
      {renderCardContent()}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
