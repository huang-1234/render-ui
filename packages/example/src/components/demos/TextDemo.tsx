import React from 'react';
import {
  View,
  Text,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Paragraph,
  Caption,
  Link,
  createStyles
} from '@cross-platform/components';

const TextDemo: React.FC = () => {
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
      marginBottom: 10,
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderRadius: 8
    },
    description: {
      marginTop: 5,
      fontSize: 14,
      color: '#666'
    },
    textStyles: {
      marginBottom: 10
    }
  });

  return (
    <View>
      {/* 基础文本 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础文本</Text>
        <View style={styles.demoContainer}>
          <Text style={styles.textStyles}>这是一个基础的文本组件</Text>
          <Text style={[styles.textStyles, { color: '#1890ff' }]}>自定义颜色的文本</Text>
          <Text style={[styles.textStyles, { fontSize: 20 }]}>自定义大小的文本</Text>
          <Text style={[styles.textStyles, { fontWeight: 'bold' }]}>粗体文本</Text>
          <Text style={[styles.textStyles, { fontStyle: 'italic' }]}>斜体文本</Text>
        </View>
        <Text style={styles.description}>
          Text组件支持自定义颜色、大小、粗细和样式等。
        </Text>
      </View>

      {/* 文本变体 */}
      <View style={styles.section}>
        <Text style={styles.title}>文本变体</Text>
        <View style={styles.demoContainer}>
          <Heading1 style={styles.textStyles}>Heading1 标题</Heading1>
          <Heading2 style={styles.textStyles}>Heading2 标题</Heading2>
          <Heading3 style={styles.textStyles}>Heading3 标题</Heading3>
          <Heading4 style={styles.textStyles}>Heading4 标题</Heading4>
          <Paragraph style={styles.textStyles}>
            这是一个段落文本，用于展示较长的文本内容。段落文本通常有适当的行高和字体大小，使得阅读更加舒适。
          </Paragraph>
          <Caption style={styles.textStyles}>这是一个说明文本，通常用于图片说明或辅助信息</Caption>
          <Link style={styles.textStyles} onPress={() => alert('链接被点击')}>
            这是一个链接文本，点击可以触发操作
          </Link>
        </View>
        <Text style={styles.description}>
          框架提供了多种预设的文本变体，包括标题、段落、说明和链接等。
        </Text>
      </View>

      {/* 文本截断 */}
      <View style={styles.section}>
        <Text style={styles.title}>文本截断</Text>
        <View style={styles.demoContainer}>
          <Text numberOfLines={1} style={styles.textStyles}>
            这是一个很长的文本，当内容超出一行时会被截断并显示省略号。这是一个很长的文本，当内容超出一行时会被截断并显示省略号。
          </Text>
          <Text numberOfLines={2} style={styles.textStyles}>
            这是一个很长的文本，当内容超出两行时会被截断并显示省略号。这是一个很长的文本，当内容超出两行时会被截断并显示省略号。这是一个很长的文本，当内容超出两行时会被截断并显示省略号。
          </Text>
        </View>
        <Text style={styles.description}>
          使用numberOfLines属性限制文本显示的行数，超出部分会显示省略号。
        </Text>
      </View>

      {/* 文本对齐 */}
      <View style={styles.section}>
        <Text style={styles.title}>文本对齐</Text>
        <View style={styles.demoContainer}>
          <Text style={[styles.textStyles, { textAlign: 'left' }]}>
            左对齐文本
          </Text>
          <Text style={[styles.textStyles, { textAlign: 'center' }]}>
            居中对齐文本
          </Text>
          <Text style={[styles.textStyles, { textAlign: 'right' }]}>
            右对齐文本
          </Text>
          <Text style={[styles.textStyles, { textAlign: 'justify' }]}>
            两端对齐文本。这是一段较长的文本内容，用于演示两端对齐的效果。两端对齐会使文本的左右边缘保持对齐，增强阅读体验。
          </Text>
        </View>
        <Text style={styles.description}>
          使用textAlign属性设置文本的对齐方式。
        </Text>
      </View>

      {/* 文本装饰 */}
      <View style={styles.section}>
        <Text style={styles.title}>文本装饰</Text>
        <View style={styles.demoContainer}>
          <Text style={[styles.textStyles, { textDecorationLine: 'underline' }]}>
            下划线文本
          </Text>
          <Text style={[styles.textStyles, { textDecorationLine: 'line-through' }]}>
            删除线文本
          </Text>
          <Text style={[styles.textStyles, { textTransform: 'uppercase' }]}>
            uppercase text
          </Text>
          <Text style={[styles.textStyles, { textTransform: 'lowercase' }]}>
            LOWERCASE TEXT
          </Text>
          <Text style={[styles.textStyles, { textTransform: 'capitalize' }]}>
            capitalize each word
          </Text>
        </View>
        <Text style={styles.description}>
          使用textDecorationLine和textTransform属性设置文本的装饰效果。
        </Text>
      </View>
    </View>
  );
};

export default TextDemo;
