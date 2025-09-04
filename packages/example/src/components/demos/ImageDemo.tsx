import React, { useState } from 'react';
import { View, Text, Image, Button, createStyles } from '@cross-platform/components';

const ImageDemo: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  // 示例图片URL
  const validImageUrl = 'https://picsum.photos/300/200';
  const invalidImageUrl = 'https://example.com/invalid-image.jpg';

  const styles = createStyles({
    section: {
      marginBottom: 20
    },
    title: {
      fontSize: 16,
      fontWeight: '500' as any,
      marginBottom: 10
    },
    demoContainer: {
      marginBottom: 10
    },
    description: {
      marginTop: 10,
      fontSize: 14,
      color: '#666'
    },
    imageContainer: {
      marginBottom: 15
    },
    basicImage: {
      width: 200,
      height: 150,
      borderRadius: 8
    },
    resizeModeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    resizeModeItem: {
      marginRight: 15,
      marginBottom: 15,
      alignItems: 'center'
    },
    resizeModeImage: {
      width: 100,
      height: 100,
      backgroundColor: '#f0f0f0',
      marginBottom: 5
    },
    resizeModeLabel: {
      fontSize: 12,
      color: '#666'
    },
    errorContainer: {
      marginTop: 20,
      alignItems: 'flex-start'
    }
  });

  return (
    <View>
      {/* 基础图片 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础图片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: validImageUrl }}
              style={styles.basicImage}
              alt="示例图片"
            />
          </View>
        </View>
        <Text style={styles.description}>
          基础的Image组件，可以显示网络图片或本地图片。
        </Text>
      </View>

      {/* 调整大小模式 */}
      <View style={styles.section}>
        <Text style={styles.title}>调整大小模式</Text>
        <View style={styles.demoContainer}>
          <View style={styles.resizeModeContainer}>
            <View style={styles.resizeModeItem}>
              <Image
                source={{ uri: validImageUrl }}
                style={styles.resizeModeImage}
                resizeMode="cover"
                alt="cover模式"
              />
              <Text style={styles.resizeModeLabel}>cover</Text>
            </View>
            <View style={styles.resizeModeItem}>
              <Image
                source={{ uri: validImageUrl }}
                style={styles.resizeModeImage}
                resizeMode="contain"
                alt="contain模式"
              />
              <Text style={styles.resizeModeLabel}>contain</Text>
            </View>
            <View style={styles.resizeModeItem}>
              <Image
                source={{ uri: validImageUrl }}
                style={styles.resizeModeImage}
                resizeMode="stretch"
                alt="stretch模式"
              />
              <Text style={styles.resizeModeLabel}>stretch</Text>
            </View>
            <View style={styles.resizeModeItem}>
              <Image
                source={{ uri: validImageUrl }}
                style={styles.resizeModeImage}
                resizeMode="center"
                alt="center模式"
              />
              <Text style={styles.resizeModeLabel}>center</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          Image组件支持多种调整大小模式，包括cover、contain、stretch和center等。
        </Text>
      </View>

      {/* 圆角图片 */}
      <View style={styles.section}>
        <Text style={styles.title}>圆角图片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.resizeModeContainer}>
            <View style={styles.resizeModeItem}>
              <Image
                source={{ uri: validImageUrl }}
                style={[styles.resizeModeImage, { borderRadius: 8 }]}
                alt="圆角图片"
              />
              <Text style={styles.resizeModeLabel}>圆角</Text>
            </View>
            <View style={styles.resizeModeItem}>
              <Image
                source={{ uri: validImageUrl }}
                style={[styles.resizeModeImage, { borderRadius: 50 }]}
                alt="圆形图片"
              />
              <Text style={styles.resizeModeLabel}>圆形</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          通过设置borderRadius属性，可以创建圆角或圆形图片。
        </Text>
      </View>

      {/* 错误处理 */}
      <View style={styles.section}>
        <Text style={styles.title}>错误处理</Text>
        <View style={styles.demoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageError ? invalidImageUrl : validImageUrl }}
              style={styles.basicImage}
              onError={() => console.log('Image failed to load')}
              alt="错误处理示例"
            />
          </View>
          <View style={styles.errorContainer}>
            <Button
              type="primary"
              size="small"
              onPress={() => setImageError(!imageError)}
            >
              {imageError ? '加载有效图片' : '模拟加载失败'}
            </Button>
          </View>
        </View>
        <Text style={styles.description}>
          Image组件提供onError回调，可以在图片加载失败时进行处理。
        </Text>
      </View>

      {/* 加载事件 */}
      <View style={styles.section}>
        <Text style={styles.title}>加载事件</Text>
        <View style={styles.demoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: validImageUrl }}
              style={styles.basicImage}
              onLoad={() => console.log('Image loaded successfully')}
              alt="加载事件示例"
            />
          </View>
        </View>
        <Text style={styles.description}>
          Image组件提供onLoad回调，可以在图片加载成功时进行处理。
        </Text>
      </View>
    </View>
  );
};

export default ImageDemo;
