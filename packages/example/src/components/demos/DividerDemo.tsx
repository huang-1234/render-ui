import React from 'react';
import { View, Text, Divider, createStyles } from '@cross-platform/components';

const DividerDemo: React.FC = () => {
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
    textBlock: {
      marginBottom: 15
    },
    verticalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60
    },
    colorContainer: {
      marginBottom: 15
    }
  });

  return (
    <View>
      {/* 基础分割线 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础分割线</Text>
        <View style={styles.demoContainer}>
          <View style={styles.textBlock}>
            <Text>上方内容</Text>
          </View>
          <Divider />
          <View style={styles.textBlock}>
            <Text>下方内容</Text>
          </View>
        </View>
        <Text style={styles.description}>
          基础的Divider组件，用于分隔内容区域。
        </Text>
      </View>

      {/* 带文字的分割线 */}
      <View style={styles.section}>
        <Text style={styles.title}>带文字的分割线</Text>
        <View style={styles.demoContainer}>
          <View style={styles.textBlock}>
            <Text>上方内容</Text>
          </View>
          <Divider>文字内容</Divider>
          <View style={styles.textBlock}>
            <Text>下方内容</Text>
          </View>
        </View>
        <Text style={styles.description}>
          可以在Divider中添加文字内容。
        </Text>
      </View>

      {/* 文字位置 */}
      <View style={styles.section}>
        <Text style={styles.title}>文字位置</Text>
        <View style={styles.demoContainer}>
          <Divider orientation="left">左侧文字</Divider>
          <View style={styles.textBlock} />
          <Divider orientation="center">居中文字</Divider>
          <View style={styles.textBlock} />
          <Divider orientation="right">右侧文字</Divider>
        </View>
        <Text style={styles.description}>
          使用orientation属性设置文字在分割线上的位置，支持left、center、right三种位置。
        </Text>
      </View>

      {/* 垂直分割线 */}
      <View style={styles.section}>
        <Text style={styles.title}>垂直分割线</Text>
        <View style={styles.demoContainer}>
          <View style={styles.verticalContainer}>
            <Text>左侧内容</Text>
            <Divider type="vertical" />
            <Text>中间内容</Text>
            <Divider type="vertical" />
            <Text>右侧内容</Text>
          </View>
        </View>
        <Text style={styles.description}>
          使用type="vertical"属性创建垂直分割线。
        </Text>
      </View>

      {/* 自定义样式 */}
      <View style={styles.section}>
        <Text style={styles.title}>自定义样式</Text>
        <View style={styles.demoContainer}>
          <View style={styles.colorContainer}>
            <Divider color="#1890ff" thickness={2} />
          </View>
          <View style={styles.colorContainer}>
            <Divider color="#52c41a" thickness={3} />
          </View>
          <View style={styles.colorContainer}>
            <Divider color="#f5222d" thickness={4} />
          </View>
        </View>
        <Text style={styles.description}>
          使用color和thickness属性自定义分割线的颜色和粗细。
        </Text>
      </View>

      {/* 虚线分割线 */}
      <View style={styles.section}>
        <Text style={styles.title}>虚线分割线</Text>
        <View style={styles.demoContainer}>
          <View style={styles.colorContainer}>
            <Divider dashed />
          </View>
          <View style={styles.colorContainer}>
            <Divider dashed color="#1890ff" />
          </View>
          <View style={styles.verticalContainer}>
            <Text>左侧</Text>
            <Divider type="vertical" dashed />
            <Text>右侧</Text>
          </View>
        </View>
        <Text style={styles.description}>
          使用dashed属性创建虚线分割线。
        </Text>
      </View>

      {/* 带间距的分割线 */}
      <View style={styles.section}>
        <Text style={styles.title}>带间距的分割线</Text>
        <View style={styles.demoContainer}>
          <View style={styles.textBlock}>
            <Text>上方内容</Text>
          </View>
          <Divider margin="30px 0" />
          <View style={styles.textBlock}>
            <Text>下方内容</Text>
          </View>
        </View>
        <Text style={styles.description}>
          使用margin属性设置分割线的外边距。
        </Text>
      </View>

      {/* 组合使用 */}
      <View style={styles.section}>
        <Text style={styles.title}>组合使用</Text>
        <View style={styles.demoContainer}>
          <View style={styles.textBlock}>
            <Text>第一部分内容</Text>
          </View>
          <Divider orientation="left" color="#1890ff">第一部分</Divider>
          <View style={styles.textBlock}>
            <Text>第二部分内容</Text>
          </View>
          <Divider orientation="left" color="#52c41a" dashed>第二部分</Divider>
          <View style={styles.textBlock}>
            <Text>第三部分内容</Text>
          </View>
          <Divider orientation="left" color="#f5222d">第三部分</Divider>
          <View style={styles.textBlock}>
            <Text>最后部分内容</Text>
          </View>
        </View>
        <Text style={styles.description}>
          组合使用Divider的各种属性，可以创建丰富的分割效果。
        </Text>
      </View>
    </View>
  );
};

export default DividerDemo;
