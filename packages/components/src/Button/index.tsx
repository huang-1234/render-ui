import React, { forwardRef, ReactNode, useState } from 'react';
import { usePlatform, createStyles, StyleObject, useUI } from '@cross-platform/core';
import classNames from 'classnames';
import Text from '../Text';
import View from '../View';

// Button 组件属性接口
export interface ButtonProps {
  children?: ReactNode;
  style?: StyleObject;
  className?: string;
  onPress?: (event: any) => void;
  onLongPress?: (event: any) => void;
  onPressIn?: (event: any) => void;
  onPressOut?: (event: any) => void;
  // 按钮属性
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'link';
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'round' | 'circle';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean; // 块级按钮
  ghost?: boolean; // 幽灵按钮
  // 图标
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  // 样式属性
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  // 其他属性
  testID?: string; // React Native
  id?: string; // H5
  'data-testid'?: string; // H5 测试
  htmlType?: 'button' | 'submit' | 'reset'; // H5 button type
}

// Button 组件实现
export const Button = forwardRef<any, ButtonProps>((props, ref) => {
  const {
    children,
    style: customStyle,
    className,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    type = 'primary',
    size = 'medium',
    shape = 'square',
    disabled = false,
    loading = false,
    block = false,
    ghost = false,
    icon,
    iconPosition = 'left',
    color,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    testID,
    id,
    'data-testid': dataTestId,
    htmlType = 'button',
    ...restProps
  } = props;

  const platform = usePlatform();
  const { showToast } = useUI();
  const [pressed, setPressed] = useState(false);

  // 获取按钮主题样式
  const getButtonTheme = () => {
    const themes = {
      primary: {
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        color: '#ffffff'
      },
      secondary: {
        backgroundColor: '#f5f5f5',
        borderColor: '#d9d9d9',
        color: '#000000'
      },
      success: {
        backgroundColor: '#52c41a',
        borderColor: '#52c41a',
        color: '#ffffff'
      },
      warning: {
        backgroundColor: '#faad14',
        borderColor: '#faad14',
        color: '#ffffff'
      },
      error: {
        backgroundColor: '#f5222d',
        borderColor: '#f5222d',
        color: '#ffffff'
      },
      info: {
        backgroundColor: '#13c2c2',
        borderColor: '#13c2c2',
        color: '#ffffff'
      },
      text: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: '#1890ff'
      },
      link: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: '#1890ff'
      }
    };

    return themes[type] || themes.primary;
  };

  // 获取按钮尺寸样式
  const getButtonSize = () => {
    const sizes = {
      small: {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 12,
        borderRadius: 4
      },
      medium: {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 14,
        borderRadius: 6
      },
      large: {
        height: 48,
        paddingHorizontal: 20,
        fontSize: 16,
        borderRadius: 8
      }
    };

    return sizes[size] || sizes.medium;
  };

  // 获取按钮形状样式
  const getButtonShape = () => {
    const sizeStyle = getButtonSize();
    
    switch (shape) {
      case 'round':
        return { borderRadius: sizeStyle.height / 2 };
      case 'circle':
        return { 
          borderRadius: sizeStyle.height / 2,
          width: sizeStyle.height,
          paddingHorizontal: 0
        };
      default:
        return { borderRadius: sizeStyle.borderRadius };
    }
  };

  // 构建按钮样式
  const theme = getButtonTheme();
  const sizeStyle = getButtonSize();
  const shapeStyle = getButtonShape();

  const buttonStyle: StyleObject = {
    // 基础样式
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    // 尺寸样式
    height: sizeStyle.height,
    paddingLeft: shapeStyle.paddingHorizontal ?? sizeStyle.paddingHorizontal,
    paddingRight: shapeStyle.paddingHorizontal ?? sizeStyle.paddingHorizontal,
    // 形状样式
    borderRadius: borderRadius ?? shapeStyle.borderRadius,
    width: shapeStyle.width,
    // 主题样式
    backgroundColor: ghost ? 'transparent' : (backgroundColor || theme.backgroundColor),
    borderColor: borderColor || theme.borderColor,
    borderWidth: borderWidth ?? 1,
    // 块级样式
    ...(block && { width: '100%' }),
    // 禁用样式
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed'
    }),
    // 按下样式
    ...(pressed && !disabled && {
      opacity: 0.8,
      transform: 'scale(0.98)'
    }),
    // 自定义样式
    ...customStyle
  };

  // 文本样式
  const textStyle: StyleObject = {
    fontSize: sizeStyle.fontSize,
    color: color || (ghost ? theme.borderColor : theme.color),
    fontWeight: '500',
    ...(disabled && { opacity: 0.6 })
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: buttonStyle,
    h5: {
      // H5 特定样式
      border: 'none',
      outline: 'none',
      transition: 'all 0.2s ease',
      '&:hover': !disabled ? {
        opacity: 0.8
      } : {},
      '&:active': !disabled ? {
        transform: 'scale(0.98)'
      } : {}
    },
    rn: {
      // React Native 特定样式
      elevation: 2, // Android 阴影
      shadowColor: '#000', // iOS 阴影
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    },
    weapp: {
      // 小程序特定样式
      border: `${borderWidth || 1}px solid ${borderColor || theme.borderColor}`
    }
  });

  // 事件处理
  const handlePress = async (event: any) => {
    if (disabled || loading) {
      return;
    }

    if (loading) {
      await showToast({ title: '请稍候...', icon: 'loading' });
      return;
    }

    onPress?.(event);
  };

  const handlePressIn = (event: any) => {
    if (!disabled) {
      setPressed(true);
      onPressIn?.(event);
    }
  };

  const handlePressOut = (event: any) => {
    setPressed(false);
    onPressOut?.(event);
  };

  const handleLongPress = (event: any) => {
    if (!disabled) {
      onLongPress?.(event);
    }
  };

  // 渲染按钮内容
  const renderContent = () => {
    const content = [];

    // 左侧图标
    if (icon && iconPosition === 'left') {
      content.push(
        <View key="left-icon" style={{ marginRight: children ? 8 : 0 }}>
          {icon}
        </View>
      );
    }

    // 文本内容
    if (children) {
      content.push(
        <Text key="text" style={textStyle}>
          {children}
        </Text>
      );
    }

    // 右侧图标
    if (icon && iconPosition === 'right') {
      content.push(
        <View key="right-icon" style={{ marginLeft: children ? 8 : 0 }}>
          {icon}
        </View>
      );
    }

    // 加载状态
    if (loading) {
      content.unshift(
        <View key="loading" style={{ marginRight: children ? 8 : 0 }}>
          <Text style={textStyle}>⏳</Text>
        </View>
      );
    }

    return content;
  };

  // 平台特定渲染
  switch (platform) {
    case 'h5':
      return (
        <button
          ref={ref}
          type={htmlType}
          className={classNames('cross-button', `cross-button-${type}`, `cross-button-${size}`, className)}
          style={styles}
          onClick={handlePress}
          onMouseDown={handlePressIn}
          onMouseUp={handlePressOut}
          onMouseLeave={handlePressOut}
          disabled={disabled}
          id={id}
          data-testid={dataTestId}
          {...restProps}
        >
          {renderContent()}
        </button>
      );

    case 'rn':
      // React Native 渲染
      const { TouchableOpacity } = require('react-native');
      return (
        <TouchableOpacity
          ref={ref}
          style={styles}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLongPress={handleLongPress}
          disabled={disabled}
          activeOpacity={0.8}
          testID={testID}
          {...restProps}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {renderContent()}
          </View>
        </TouchableOpacity>
      );

    case 'weapp':
    case 'alipay':
    case 'tt':
      // 小程序渲染
      return (
        <button
          ref={ref}
          className={classNames('cross-button', `cross-button-${type}`, `cross-button-${size}`, className)}
          style={styles}
          onClick={handlePress}
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
          onLongPress={handleLongPress}
          disabled={disabled}
          loading={loading}
          {...restProps}
        >
          {!loading && renderContent()}
        </button>
      );

    default:
      // 默认渲染（H5）
      return (
        <button
          ref={ref}
          className={classNames('cross-button', className)}
          style={styles}
          onClick={handlePress}
          disabled={disabled}
          {...restProps}
        >
          {renderContent()}
        </button>
      );
  }
});

Button.displayName = 'Button';

export default Button;