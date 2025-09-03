import { Platform } from 'react-native';

/**
 * 图片处理工具类
 * 提供图片压缩、格式转换等功能
 */
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
      // 在实际应用中，这里应该使用 react-native-image-manipulator
      // 或其他图片处理库进行压缩
      // 由于依赖问题，这里简单返回原始URI
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
   * Native平台WebP转换
   * 在实际应用中，这应该使用原生模块进行转换
   */
  private static async convertToWebPNative(uri: string): Promise<string> {
    // 由于依赖问题，这里简单返回原始URI
    // 实际应用中应该使用 react-native-image-manipulator 等库
    return uri;
  }

  /**
   * 检查WebP支持
   */
  static supportsWebP(): boolean {
    if (Platform.OS === 'web') {
      try {
        return document.createElement('canvas')
          .toDataURL('image/webp')
          .indexOf('data:image/webp') === 0;
      } catch (e) {
        return false;
      }
    }

    // Native平台默认支持WebP
    return true;
  }

  /**
   * 构建处理后的图片URL
   * 添加质量、尺寸等参数
   */
  static buildProcessedImageUrl(
    uri: string,
    options: {
      enableCompress?: boolean;
      enableWebP?: boolean;
      quality?: number;
      width?: number;
      height?: number;
    }
  ): string {
    if (typeof uri !== 'string') return uri;

    try {
      const url = new URL(uri);
      const params = new URLSearchParams(url.search);

      const { enableCompress, enableWebP, quality, width, height } = options;

      if (enableCompress && quality !== undefined) {
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

      url.search = params.toString();
      return url.toString();
    } catch (e) {
      // 如果URL解析失败，返回原始URI
      return uri;
    }
  }
}

export default ImageProcessor;
