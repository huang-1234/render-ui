import React, { forwardRef, ReactNode, useState } from 'react';
import { createStyles, StyleObject, useUI } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';
import Text from '../Text';

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

// Button 组件实现 - 小程序版本
const Button = forwardRef<any, ButtonProps>((props, ref) => {
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
      opacity: 0.6
    }),
    // 按下样式
    ...(pressed && !disabled && {
      opacity: 0.8
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

    return content;
  };

  // 小程序特定属性
  const buttonProps = {
    className: classNames('cross-button', `cross-button-${type}`, `cross-button-${size}`, className),
    style: styles,
    onClick: handlePress,
    onTouchStart: handlePressIn,
    onTouchEnd: handlePressOut,
    onLongPress: handleLongPress,
    disabled,
    loading,
    ...restProps
  };

  return React.createElement(
    'button',
    {
      ref,
      ...buttonProps
    },
    !loading && renderContent()
  );
});

Button.displayName = 'Button';

export default Button;
