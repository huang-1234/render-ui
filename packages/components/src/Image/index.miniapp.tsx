import React, { forwardRef, useState } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

// Image 组件属性接口
export interface ImageProps {
  source: { uri: string } | number | string;
  alt?: string;
  style?: StyleObject;
  className?: string;
  width?: number | string;
  height?: number | string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  borderRadius?: number;
  onLoad?: (event: any) => void;
  onError?: (event: any) => void;
  onPress?: (event: any) => void;
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// Image 组件实现 - 小程序版本
const Image = forwardRef<any, ImageProps>((props, ref) => {
  const {
    source,
    alt,
    style,
    className,
    width,
    height,
    resizeMode = 'cover',
    borderRadius,
    onLoad,
    onError,
    onPress,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 处理图片源
  const getImageSource = () => {
    if (typeof source === 'string') {
      return source;
    } else if (typeof source === 'number') {
      // 小程序环境中无法直接使用 require 数字引用
      console.warn('小程序环境不支持数字类型的图片引用');
      return '';
    } else if (source && typeof source === 'object' && 'uri' in source) {
      return source.uri;
    }
    return '';
  };

  // 构建样式对象
  const imageStyle: StyleObject = {
    // 基础样式
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(hasError && { backgroundColor: '#f0f0f0' }),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: imageStyle
  });

  // 获取小程序图片模式
  const getMode = () => {
    switch (resizeMode) {
      case 'cover': return 'aspectFill';
      case 'contain': return 'aspectFit';
      case 'stretch': return 'scaleToFill';
      case 'repeat': return 'aspectFill'; // 小程序不支持repeat
      case 'center': return 'center';
      default: return 'aspectFill';
    }
  };

  // 事件处理
  const handleLoad = (event: any) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: any) => {
    setHasError(true);
    onError?.(event);
  };

  const handleClick = (event: any) => {
    onPress?.(event);
  };

  // 小程序特定属性
  const imageProps = {
    src: getImageSource(),
    mode: getMode(),
    className: classNames('cross-image', className),
    style: styles,
    onLoad: handleLoad,
    onError: handleError,
    onClick: onPress && handleClick,
    ...restProps
  };

  // 由于 TypeScript 不识别小程序标签，我们需要使用 React.createElement
  return React.createElement(
    'image',
    {
      ref,
      ...imageProps
    }
  );
});

Image.displayName = 'Image';

export default Image;
