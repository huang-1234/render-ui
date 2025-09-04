import React, { forwardRef } from 'react';
import { StyleObject } from '@cross-platform/core';
import { Text as RNText } from 'react-native';
import { IconMap, IconName } from './iconMap';

// Icon 组件属性接口
export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleObject;
  className?: string;
  spin?: boolean;
  rotate?: number;
  onClick?: (event: any) => void;
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// Icon 组件实现 - React Native 版本
const Icon = forwardRef<any, IconProps>((props, ref) => {
  const {
    name,
    size = 24,
    color,
    style,
    className,
    spin = false,
    rotate,
    onClick,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  // 构建样式对象
  const iconStyle = {
    // 基础样式
    fontFamily: 'iconfont',
    fontSize: size,
    lineHeight: size,
    color: color || '#333',
    ...(onClick && { cursor: 'pointer' }),
    ...(rotate !== undefined && { transform: `rotate(${rotate}deg)` }),
    ...(spin && {
      animation: 'cross-icon-spin 1s infinite linear'
    }),
    // React Native 特定样式
    textAlign: 'center',
    ...(style || {})
  };

  return (
    <RNText
      ref={ref}
      style={iconStyle}
      onPress={onClick}
      testID={testID}
      {...restProps}
    >
      {IconMap[name]}
    </RNText>
  );
});

Icon.displayName = 'Icon';

export default Icon;
export { IconName };
export { IconMap };