import React, { forwardRef, useState } from 'react';
import { StyleObject } from '@cross-platform/core';
import { Image as RNImage } from 'react-native';

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

// Image 组件实现 - React Native 版本
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
      return { uri: source };
    } else if (typeof source === 'number') {
      // 处理 require('./image.png') 的情况
      return source;
    } else if (source && typeof source === 'object' && 'uri' in source) {
      return source;
    }
    return { uri: '' };
  };

  // 构建样式对象
  const imageStyle = {
    // 基础样式
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(style || {})
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

  return (
    <RNImage
      ref={ref}
      source={getImageSource()}
      style={imageStyle}
      resizeMode={resizeMode}
      onLoad={handleLoad}
      onError={handleError}
      testID={testID}
      accessible={!!alt}
      accessibilityLabel={alt}
      {...restProps}
    />
  );
});

Image.displayName = 'Image';

export default Image;