import React, { forwardRef } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
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

// Icon 组件实现 - Web 版本
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
  const iconStyle: StyleObject = {
    // 基础样式
    fontFamily: 'iconfont',
    fontSize: size,
    lineHeight: size + 'px',
    color: color || '#333',
    ...(onClick && { cursor: 'pointer' }),
    ...(rotate !== undefined && { transform: `rotate(${rotate}deg)` }),
    ...(spin && {
      animation: 'cross-icon-spin 1s infinite linear'
    }),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: iconStyle,
    h5: {
      // H5 特定样式
      display: 'inline-block',
      fontStyle: 'normal',
      fontVariant: 'normal',
      textRendering: 'auto',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      speak: 'none',
      ...(spin && {
        '@keyframes cross-icon-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      })
    }
  });

  // 事件处理
  const handleClick = (event: any) => {
    onClick?.(event);
  };

  return (
    <i
      ref={ref}
      className={classNames('cross-icon', `cross-icon-${name}`, className)}
      style={styles}
      onClick={onClick && handleClick}
      id={id}
      data-testid={dataTestId || testID}
      {...restProps}
    >
      {IconMap[name]}
    </i>
  );
});

Icon.displayName = 'Icon';

export default Icon;
export { IconName };
export { IconMap };
