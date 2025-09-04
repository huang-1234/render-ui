import React, { useState } from 'react';
import { View, Text, Button, Icon, createStyles } from '@cross-platform/components';

const ButtonDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

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
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 15
    },
    buttonSpacing: {
      marginRight: 10,
      marginBottom: 10
    },
    description: {
      marginTop: 5,
      fontSize: 14,
      color: '#666'
    }
  });

  return (
    <View>
      {/* 按钮类型 */}
      <View style={styles.section}>
        <Text style={styles.title}>按钮类型</Text>
        <View style={styles.demoContainer}>
          <View style={styles.buttonRow}>
            <Button style={styles.buttonSpacing} type="primary">主要按钮</Button>
            <Button style={styles.buttonSpacing} type="secondary">次要按钮</Button>
            <Button style={styles.buttonSpacing} type="success">成功按钮</Button>
            <Button style={styles.buttonSpacing} type="warning">警告按钮</Button>
            <Button style={styles.buttonSpacing} type="error">错误按钮</Button>
            <Button style={styles.buttonSpacing} type="info">信息按钮</Button>
            <Button style={styles.buttonSpacing} type="text">文本按钮</Button>
            <Button style={styles.buttonSpacing} type="link">链接按钮</Button>
          </View>
        </View>
        <Text style={styles.description}>
          Button组件支持多种类型，包括主要、次要、成功、警告、错误、信息、文本和链接等。
        </Text>
      </View>

      {/* 按钮尺寸 */}
      <View style={styles.section}>
        <Text style={styles.title}>按钮尺寸</Text>
        <View style={styles.demoContainer}>
          <View style={styles.buttonRow}>
            <Button style={styles.buttonSpacing} type="primary" size="large">大按钮</Button>
            <Button style={styles.buttonSpacing} type="primary" size="medium">中按钮</Button>
            <Button style={styles.buttonSpacing} type="primary" size="small">小按钮</Button>
          </View>
        </View>
        <Text style={styles.description}>
          Button组件支持大、中、小三种尺寸。
        </Text>
      </View>

      {/* 按钮形状 */}
      <View style={styles.section}>
        <Text style={styles.title}>按钮形状</Text>
        <View style={styles.demoContainer}>
          <View style={styles.buttonRow}>
            <Button style={styles.buttonSpacing} type="primary" shape="square">方形按钮</Button>
            <Button style={styles.buttonSpacing} type="primary" shape="round">圆角按钮</Button>
            <Button style={styles.buttonSpacing} type="primary" shape="circle">○</Button>
          </View>
        </View>
        <Text style={styles.description}>
          Button组件支持方形、圆角和圆形三种形状。
        </Text>
      </View>

      {/* 按钮状态 */}
      <View style={styles.section}>
        <Text style={styles.title}>按钮状态</Text>
        <View style={styles.demoContainer}>
          <View style={styles.buttonRow}>
            <Button style={styles.buttonSpacing} type="primary">正常状态</Button>
            <Button style={styles.buttonSpacing} type="primary" disabled>禁用状态</Button>
            <Button
              style={styles.buttonSpacing}
              type="primary"
              loading={loading}
              onPress={handleLoadingButtonClick}
            >
              {loading ? '加载中...' : '点击加载'}
            </Button>
          </View>
        </View>
        <Text style={styles.description}>
          Button组件支持正常、禁用和加载中三种状态。
        </Text>
      </View>

      {/* 幽灵按钮 */}
      <View style={styles.section}>
        <Text style={styles.title}>幽灵按钮</Text>
        <View style={[styles.demoContainer, { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8 }]}>
          <View style={styles.buttonRow}>
            <Button style={styles.buttonSpacing} type="primary" ghost>主要按钮</Button>
            <Button style={styles.buttonSpacing} type="success" ghost>成功按钮</Button>
            <Button style={styles.buttonSpacing} type="error" ghost>错误按钮</Button>
          </View>
        </View>
        <Text style={styles.description}>
          幽灵按钮将按钮的内容反色，背景变为透明，常用在有色背景上。
        </Text>
      </View>

      {/* 带图标的按钮 */}
      <View style={styles.section}>
        <Text style={styles.title}>带图标的按钮</Text>
        <View style={styles.demoContainer}>
          <View style={styles.buttonRow}>
            <Button
              style={styles.buttonSpacing}
              type="primary"
              icon={<Icon name="search" size={16} color="#fff" />}
            >
              搜索
            </Button>
            <Button
              style={styles.buttonSpacing}
              type="success"
              icon={<Icon name="check-circle" size={16} color="#fff" />}
            >
              确认
            </Button>
            <Button
              style={styles.buttonSpacing}
              type="error"
              icon={<Icon name="close-circle" size={16} color="#fff" />}
              iconPosition="right"
            >
              取消
            </Button>
          </View>
        </View>
        <Text style={styles.description}>
          Button组件支持在左侧或右侧添加图标。
        </Text>
      </View>

      {/* 块级按钮 */}
      <View style={styles.section}>
        <Text style={styles.title}>块级按钮</Text>
        <View style={styles.demoContainer}>
          <Button type="primary" block style={{ marginBottom: 10 }}>
            块级主要按钮
          </Button>
          <Button type="secondary" block>
            块级次要按钮
          </Button>
        </View>
        <Text style={styles.description}>
          使用block属性将按钮设置为块级按钮，宽度为100%。
        </Text>
      </View>
    </View>
  );
};

export default ButtonDemo;
