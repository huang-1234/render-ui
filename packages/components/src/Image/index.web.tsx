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

// Image 组件实现 - Web 版本
const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
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
      // Web 环境中无法直接使用 require 数字引用
      console.warn('Web 环境不支持数字类型的图片引用');
      return '';
    } else if (source && typeof source === 'object' && 'uri' in source) {
      return source.uri;
    }
    return '';
  };

  // 构建样式对象
  const imageStyle: StyleObject = {
    // 基础样式
    maxWidth: '100%',
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
    objectFit: resizeMode === 'cover' ? 'cover' :
               resizeMode === 'contain' ? 'contain' :
               resizeMode === 'stretch' ? 'fill' :
               resizeMode === 'center' ? 'none' : 'cover',
    ...(hasError && { backgroundColor: '#f0f0f0' }),
    ...(style || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: imageStyle,
    h5: {
      // H5 特定样式
      display: 'block',
      ...(resizeMode === 'repeat' && { backgroundRepeat: 'repeat', backgroundSize: 'auto' })
    }
  });

  // 事件处理
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    onPress?.(event);
  };

  return (
    <img
      ref={ref}
      src={getImageSource()}
      alt={alt || ''}
      className={classNames('cross-image', className)}
      style={styles}
      onClick={onPress && handleClick}
      onLoad={handleLoad}
      onError={handleError}
      id={id}
      data-testid={dataTestId || testID}
      {...restProps}
    />
  );
});

Image.displayName = 'Image';

export default Image;
