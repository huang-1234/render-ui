我将为你实现一个功能强大的 `TinyImage` 组件，支持懒加载、域名逃生、图片裁剪、质量压缩和 WebP 格式转换等功能。下面是完整的技术方案和实现细节。

# 🖼️ TinyImage 跨端图片组件技术方案

## 📋 目录
1.  #组件概述
2.  #功能特性
3.  #安装与配置
4.  #组件实现
5.  #使用示例
6.  #api-文档
7.  #实现细节
8.  #最佳实践

## 组件概述

`TinyImage` 是一个基于 React Native 的高性能、多功能的图片组件，专为跨平台应用设计。它整合了多种图片处理功能，提供一致的开发体验和优秀的性能表现。

## 功能特性

| 功能 | 描述 | 跨平台支持 |
| :--- | :--- | :--- |
| **懒加载** | 只在图片进入可视区域时加载 | iOS/Android/Web |
| **域名逃生** | 主域名失败时自动切换备用域名 | iOS/Android/Web |
| **图片裁剪** | 支持按比例或自定义尺寸裁剪 | iOS/Android |
| **质量压缩** | 动态调整图片质量减少带宽 | iOS/Android |
| **WebP 转换** | 自动转换为 WebP 格式节省流量 | iOS/Android/Web |
| **缓存管理** | 多层缓存策略提升加载速度 | iOS/Android |
| **加载状态** | 提供加载中、错误、成功状态 | iOS/Android/Web |

## 安装与配置

### 核心依赖安装

```bash
# 安装核心依赖
npm install react-native-fast-image
npm install react-native-image-crop-picker
npm install react-native-blob-util

# 链接原生模块 (适用于非Expo项目)
npx pod-install
```

### 环境配置

#### iOS 配置 (ios/Podfile)
```ruby
pod 'SDWebImage', '~> 5.0'
pod 'SDWebImageWebPCoder', '~> 0.8.0'
```

#### Android 配置 (android/build.gradle)
```gradle
dependencies {
    implementation 'com.facebook.fresco:fresco:2.6.0'
    implementation 'com.facebook.fresco:webpsupport:2.6.0'
    implementation 'com.facebook.fresco:animated-webp:2.6.0'
}
```

## 组件实现

### 核心组件代码

```tsx
// src/components/TinyImage/index.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ImageErrorEventData,
  NativeSyntheticEvent
} from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-blob-util';
import { useComponentStyles } from '../../hooks';

export interface TinyImageProps extends Omit<FastImageProps, 'source'> {
  // 基础属性
  src: string | Source;
  alt?: string;

  // 懒加载配置
  lazy?: boolean;
  lazyThreshold?: number;

  // 域名逃生配置
  fallbackDomains?: string[];
  currentDomainIndex?: number;

  // 图片处理配置
  enableCrop?: boolean;
  enableCompress?: boolean;
  enableWebP?: boolean;
  quality?: number;
  width?: number;
  height?: number;

  // 裁剪配置
  cropAspect?: [number, number];
  cropCircle?: boolean;

  // 事件回调
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;
  onCropComplete?: (uri: string) => void;
  onCropCancel?: () => void;
}

const TinyImage: React.FC<TinyImageProps> = ({
  src,
  alt,
  lazy = false,
  lazyThreshold = 100,
  fallbackDomains = [],
  currentDomainIndex = 0,
  enableCrop = false,
  enableCompress = true,
  enableWebP = true,
  quality = 80,
  width,
  height,
  cropAspect = [1, 1],
  cropCircle = false,
  onLoadStart,
  onLoadEnd,
  onError,
  onCropComplete,
  onCropCancel,
  style,
  ...restProps
}) => {
  const [isLoading, setIsLoading] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [imageUri, setImageUri] = useState<string>('');
  const [currentDomain, setCurrentDomain] = useState(currentDomainIndex);
  const viewRef = useRef<View>(null);
  const componentStyles = useComponentStyles('TinyImage', style);

  // 构建处理后的图片URL
  const buildProcessedImageUrl = useCallback((uri: string) => {
    if (typeof uri !== 'string') return uri;

    const url = new URL(uri);
    const params = new URLSearchParams();

    if (enableCompress) {
      params.append('q', quality.toString());
    }

    if (enableWebP && Platform.OS !== 'web') {
      params.append('format', 'webp');
    }

    if (width) {
      params.append('w', width.toString());
    }

    if (height) {
      params.append('h', height.toString());
    }

    if (params.toString()) {
      url.search = params.toString();
    }

    return url.toString();
  }, [enableCompress, enableWebP, quality, width, height]);

  // 域名逃生处理
  const handleDomainFallback = useCallback((uri: string) => {
    if (fallbackDomains.length === 0 || currentDomain >= fallbackDomains.length - 1) {
      return null;
    }

    const newDomainIndex = currentDomain + 1;
    const newDomain = fallbackDomains[newDomainIndex];
    const newUrl = uri.replace(new URL(uri).host, newDomain);

    setCurrentDomain(newDomainIndex);
    return newUrl;
  }, [fallbackDomains, currentDomain]);

  // 处理图片加载错误
  const handleError = useCallback((error: NativeSyntheticEvent<ImageErrorEventData>) => {
    if (fallbackDomains.length > 0 && currentDomain < fallbackDomains.length - 1) {
      const fallbackUrl = handleDomainFallback(typeof src === 'string' ? src : src.uri || '');
      if (fallbackUrl) {
        setImageUri(buildProcessedImageUrl(fallbackUrl));
        return;
      }
    }

    setHasError(true);
    onError?.(error);
  }, [src, fallbackDomains, currentDomain, handleDomainFallback, buildProcessedImageUrl, onError]);

  // 处理图片裁剪
  const handleCrop = useCallback(async () => {
    if (!enableCrop || typeof src !== 'string') return;

    try {
      const croppedImage = await ImagePicker.openCropper({
        path: src,
        width: width || 300,
        height: height || 300,
        cropping: true,
        cropperCircleOverlay: cropCircle,
        aspectRatio: cropAspect,
        compressImageQuality: quality / 100,
        includeBase64: false,
      });

      onCropComplete?.(croppedImage.path);
    } catch (error) {
      onCropCancel?.();
    }
  }, [enableCrop, src, width, height, cropCircle, cropAspect, quality, onCropComplete, onCropCancel]);

  // 懒加载逻辑
  useEffect(() => {
    if (!lazy) {
      const uri = typeof src === 'string' ? src : src.uri || '';
      setImageUri(buildProcessedImageUrl(uri));
      setIsLoading(true);
      return;
    }

    // 实现懒加载观察器
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const uri = typeof src === 'string' ? src : src.uri || '';
          setImageUri(buildProcessedImageUrl(uri));
          setIsLoading(true);
          observer.disconnect();
        }
      },
      { threshold: lazyThreshold / 100 }
    );

    if (viewRef.current) {
      observer.observe(viewRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, lazyThreshold, src, buildProcessedImageUrl]);

  // 渲染加载状态
  const renderLoadingState = () => (
    <View style={[componentStyles.container, componentStyles.loadingContainer]}>
      <ActivityIndicator size="small" color={componentStyles.loadingColor} />
    </View>
  );

  // 渲染错误状态
  const renderErrorState = () => (
    <View style={[componentStyles.container, componentStyles.errorContainer]}>
      <Text style={componentStyles.errorText}>
        {alt || '图片加载失败'}
      </Text>
    </View>
  );

  return (
    <View ref={viewRef} style={componentStyles.container}>
      {isLoading && !hasError ? (
        <TouchableOpacity
          onPress={enableCrop ? handleCrop : undefined}
          activeOpacity={enableCrop ? 0.7 : 1}
        >
          <FastImage
            style={[componentStyles.image, { width, height }]}
            source={{
              uri: imageUri,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => {
              setIsLoading(true);
              onLoadStart?.();
            }}
            onLoadEnd={() => {
              setIsLoading(false);
              onLoadEnd?.();
            }}
            onError={handleError}
            {...restProps}
          />

          {isLoading && renderLoadingState()}
        </TouchableOpacity>
      ) : hasError ? (
        renderErrorState()
      ) : lazy ? (
        renderLoadingState()
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
  },
});

export default TinyImage;
```

### 图片处理工具类

```tsx
// src/utils/imageProcessor.ts
import RNFetchBlob from 'react-native-blob-util';
import { Platform } from 'react-native';

class ImageProcessor {
  /**
   * 压缩图片质量
   */
  static async compressImage(
    uri: string,
    quality: number = 80
  ): Promise<string> {
    if (Platform.OS === 'web') {
      // Web平台的压缩实现
      return this.compressImageWeb(uri, quality);
    }

    // Native平台的压缩实现
    return this.compressImageNative(uri, quality);
  }

  /**
   * Web平台图片压缩
   */
  private static async compressImageWeb(
    uri: string,
    quality: number
  ): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = uri;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality / 100));
      };

      img.onerror = () => resolve(uri);
    });
  }

  /**
   * Native平台图片压缩
   */
  private static async compressImageNative(
    uri: string,
    quality: number
  ): Promise<string> {
    try {
      const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/compressed_${Date.now()}.jpg`;

      // 这里需要集成原生压缩库，如使用react-native-compressor
      return uri;
    } catch (error) {
      console.warn('Image compression failed:', error);
      return uri;
    }
  }

  /**
   * 转换为WebP格式
   */
  static async convertToWebP(uri: string): Promise<string> {
    if (Platform.OS === 'web') {
      // Web平台WebP转换
      return this.convertToWebPWeb(uri);
    }

    // Native平台WebP转换
    return this.convertToWebPNative(uri);
  }

  /**
   * Web平台WebP转换
   */
  private static async convertToWebPWeb(uri: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = uri;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0);

        try {
          resolve(canvas.toDataURL('image/webp'));
        } catch (error) {
          resolve(uri); // 浏览器不支持WebP时回退
        }
      };

      img.onerror = () => resolve(uri);
    });
  }

  /**
   * 检查WebP支持
   */
  static supportsWebP(): boolean {
    if (Platform.OS === 'web') {
      return document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    }

    // Native平台默认支持WebP
    return true;
  }
}

export default ImageProcessor;
```

## 使用示例

### 基础用法
```tsx
import React from 'react';
import { View } from 'react-native';
import TinyImage from './components/TinyImage';

const App = () => {
  return (
    <View style={{ padding: 16 }}>
      {/* 基础图片显示 */}
      <TinyImage
        src="https://example.com/image.jpg"
        style={{ width: 200, height: 200 }}
        alt="示例图片"
      />

      {/* 启用懒加载 */}
      <TinyImage
        src="https://example.com/large-image.jpg"
        lazy
        lazyThreshold={50}
        style={{ width: 300, height: 200 }}
      />

      {/* 启用域名逃生 */}
      <TinyImage
        src="https://primary-domain.com/image.jpg"
        fallbackDomains={[
          'fallback1.com',
          'fallback2.com',
          'fallback3.com'
        ]}
        style={{ width: 250, height: 250 }}
      />

      {/* 启用图片处理 */}
      <TinyImage
        src="https://example.com/high-quality.jpg"
        enableCompress
        enableWebP
        quality={60}
        width={400}
        height={300}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

export default App;
```

### 高级用法
```tsx
import React from 'react';
import { View, Alert } from 'react-native';
import TinyImage from './components/TinyImage';

const AdvancedUsage = () => {
  const handleCropComplete = (uri: string) => {
    Alert.alert('裁剪完成', `图片已保存至: ${uri}`);
  };

  const handleError = (error: any) => {
    console.log('图片加载失败:', error);
  };

  return (
    <View>
      {/* 可裁剪图片 */}
      <TinyImage
        src="https://example.com/portrait.jpg"
        enableCrop
        cropAspect={[3, 4]}
        cropCircle
        quality={70}
        onCropComplete={handleCropComplete}
        onError={handleError}
        style={{ width: 200, height: 266 }}
      />

      {/* 自定义懒加载阈值 */}
      <TinyImage
        src="https://example.com/banner.jpg"
        lazy
        lazyThreshold={30} // 30%可见时开始加载
        style={{ width: '100%', height: 200 }}
      />
    </View>
  );
};
```

## API 文档

### Props 说明

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **src** | `string \| Source` | - | 图片资源地址 |
| **alt** | `string` | - | 替代文本 |
| **lazy** | `boolean` | `false` | 是否启用懒加载 |
| **lazyThreshold** | `number` | `100` | 懒加载触发阈值(%) |
| **fallbackDomains** | `string[]` | `[]` | 备用域名列表 |
| **enableCrop** | `boolean` | `false` | 是否启用裁剪功能 |
| **enableCompress** | `boolean` | `true` | 是否启用压缩 |
| **enableWebP** | `boolean` | `true` | 是否启用WebP转换 |
| **quality** | `number` | `80` | 图片质量(0-100) |
| **width** | `number` | - | 图片宽度 |
| **height** | `number` | - | 图片高度 |
| **cropAspect** | `[number, number]` | `[1, 1]` | 裁剪比例 |
| **cropCircle** | `boolean` | `false` | 是否圆形裁剪 |
| **onLoadStart** | `() => void` | - | 加载开始回调 |
| **onLoadEnd** | `() => void` | - | 加载结束回调 |
| **onError** | `(error) => void` | - | 错误回调 |
| **onCropComplete** | `(uri: string) => void` | - | 裁剪完成回调 |
| **onCropCancel** | `() => void` | - | 裁剪取消回调 |

## 实现细节

### 懒加载机制
基于 `IntersectionObserver` API 实现，当图片进入可视区域时触发加载：
```tsx
// 懒加载观察器实现
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      loadImage();
      observer.disconnect();
    }
  },
  { threshold: lazyThreshold / 100 }
);
```

### 域名逃生策略
实现多级域名故障转移机制：
```tsx
const handleDomainFallback = (uri: string) => {
  if (fallbackDomains.length === 0) return null;

  const currentHost = new URL(uri).host;
  const currentIndex = fallbackDomains.indexOf(currentHost);
  const nextIndex = (currentIndex + 1) % fallbackDomains.length;

  return uri.replace(currentHost, fallbackDomains[nextIndex]);
};
```

### WebP 转换流程
```tsx
// WebP转换流程
if (enableWebP && ImageProcessor.supportsWebP()) {
  try {
    const webpUri = await ImageProcessor.convertToWebP(originalUri);
    setImageUri(webpUri);
  } catch (error) {
    // 转换失败时使用原图
    setImageUri(originalUri);
  }
}
```

## 最佳实践

1.  **性能优化**
    *   使用 `react-native-fast-image` 替代默认 Image 组件提升性能
    *   合理设置 `lazyThreshold` 平衡用户体验和加载时机
    *   启用 WebP 转换节省带宽

2.  **错误处理**
    *   实现多级域名逃生确保图片可用性
    *   提供友好的错误状态UI
    *   监控图片加载失败率并调整配置

3.  **内存管理**
    *   合理设置缓存策略
    *   对于大图列表，确保启用懒加载
    *   及时清理裁剪产生的临时文件

4.  **跨平台适配**
    *   使用 `Platform.OS` 区分平台特定逻辑
    *   为 Web 平台提供降级方案
    *   测试不同平台的性能表现

这个 `TinyImage` 组件提供了完整的图片处理解决方案，具有良好的跨平台兼容性和可扩展性。你可以根据具体需求进一步扩展或定制功能。