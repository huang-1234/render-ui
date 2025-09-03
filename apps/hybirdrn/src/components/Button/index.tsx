import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
  Platform
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import Text from '../Text';

export interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  large?: boolean;
  outline?: boolean;
  ghost?: boolean;
  secondary?: boolean;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  block?: boolean;
  rounded?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  testID?: string;
  children?: React.ReactNode;
}

const Button = ({
  title,
  loading,
  disabled,
  small,
  large,
  outline,
  ghost,
  secondary,
  success,
  warning,
  error,
  block,
  rounded,
  iconLeft,
  iconRight,
  style,
  testID,
  children,
  ...restProps
}: ButtonProps) => {
  const componentStyles = useComponentStyles('Button');

  const buttonStyles = [
    componentStyles.button,
    small && componentStyles.small,
    large && componentStyles.large,
    outline && componentStyles.outline,
    ghost && componentStyles.ghost,
    secondary && componentStyles.secondary,
    success && componentStyles.success,
    warning && componentStyles.warning,
    error && componentStyles.error,
    block && componentStyles.block,
    rounded && componentStyles.rounded,
    (disabled || loading) && componentStyles.disabled,
    loading && componentStyles.loading,
    style,
  ];

  const textStyles = [
    componentStyles.text,
    outline && componentStyles.outlineText,
    ghost && componentStyles.ghostText,
  ];

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  const content = children || (
    <>
      {iconLeft && <View style={componentStyles.iconLeft}>{iconLeft}</View>}
      {title && <Text style={textStyles}>{title}</Text>}
      {iconRight && <View style={componentStyles.iconRight}>{iconRight}</View>}
    </>
  );

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...webProps}
      {...restProps}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={outline ? componentStyles.outlineText.color : '#fff'} />
          {title && <Text style={[textStyles, { marginLeft: 8 }]}>{title}</Text>}
        </>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

export default Button;
