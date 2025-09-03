import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, Platform } from 'react-native';
import { useComponentStyles } from '../../hooks';

export interface TextProps extends RNTextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  paragraph?: boolean;
  bold?: boolean;
  italic?: boolean;
  center?: boolean;
  small?: boolean;
  large?: boolean;
  primary?: boolean;
  secondary?: boolean;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  testID?: string;
  children?: React.ReactNode;
}

const Text = ({
  h1,
  h2,
  h3,
  h4,
  paragraph,
  bold,
  italic,
  center,
  small,
  large,
  primary,
  secondary,
  error,
  success,
  warning,
  style,
  testID,
  children,
  ...restProps
}: TextProps) => {
  const componentStyles = useComponentStyles('Text');

  const textStyles = [
    componentStyles.text,
    h1 && componentStyles.h1,
    h2 && componentStyles.h2,
    h3 && componentStyles.h3,
    h4 && componentStyles.h4,
    paragraph && componentStyles.paragraph,
    bold && componentStyles.bold,
    italic && componentStyles.italic,
    center && componentStyles.center,
    small && componentStyles.small,
    large && componentStyles.large,
    primary && componentStyles.primary,
    secondary && componentStyles.secondary,
    error && componentStyles.error,
    success && componentStyles.success,
    warning && componentStyles.warning,
    style,
  ];

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  return (
    <RNText style={textStyles} {...webProps} {...restProps}>
      {children}
    </RNText>
  );
};

export default Text;
