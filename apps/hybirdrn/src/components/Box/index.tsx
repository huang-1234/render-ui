import React from 'react';
import { View, type ViewProps, Platform } from 'react-native';
import { useComponentStyles } from '../../hooks';

export interface BoxProps extends ViewProps {
  row?: boolean;
  center?: boolean;
  padding?: boolean;
  margin?: boolean;
  border?: boolean;
  shadow?: boolean;
  testID?: string;
  children?: React.ReactNode;
}

const Box = ({
  row,
  center,
  padding,
  margin,
  border,
  shadow,
  style,
  testID,
  children,
  ...restProps
}: BoxProps) => {
  const componentStyles = useComponentStyles('Box');

  const boxStyles = [
    componentStyles.container,
    row && componentStyles.row,
    center && componentStyles.center,
    padding && componentStyles.padding,
    margin && componentStyles.margin,
    border && componentStyles.border,
    shadow && componentStyles.shadow,
    style,
  ];

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  return (
    <View style={boxStyles} {...webProps} {...restProps}>
      {children}
    </View>
  );
};

export default Box;
