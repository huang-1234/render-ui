import React from 'react';
import { View, Text, createStyles } from '@cross-platform/components';

const ViewDemo: React.FC = () => {
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
      marginBottom: 20
    },
    basicView: {
      width: 100,
      height: 100,
      backgroundColor: '#1890ff',
      margin: 10
    },
    flexContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    flexItem: {
      width: 80,
      height: 80,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    borderDemo: {
      width: 100,
      height: 100,
      margin: 10,
      borderWidth: 2,
      borderColor: '#1890ff',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center'
    },
    positionContainer: {
      position: 'relative',
      width: 200,
      height: 200,
      backgroundColor: '#f0f0f0',
      margin: 10
    },
    positionedItem: {
      position: 'absolute',
      width: 50,
      height: 50,
      backgroundColor: '#1890ff',
      justifyContent: 'center',
      alignItems: 'center'
    },
    description: {
      marginTop: 10,
      fontSize: 14,
      color: '#666'
    }
  });

  return (
    <View>
      {/* 基础View */}
      <View style={styles.section}>
        <Text style={styles.title}>基础View</Text>
        <View style={styles.demoContainer}>
          <View style={styles.basicView} />
        </View>
        <Text style={styles.description}>
          基础的View组件，可以设置宽高、背景色等样式。
        </Text>
      </View>

      {/* Flex布局 */}
      <View style={styles.section}>
        <Text style={styles.title}>Flex布局</Text>
        <View style={styles.flexContainer}>
          <View style={[styles.flexItem, { backgroundColor: '#1890ff' }]}>
            <Text style={{ color: '#fff' }}>Item 1</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#52c41a' }]}>
            <Text style={{ color: '#fff' }}>Item 2</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#faad14' }]}>
            <Text style={{ color: '#fff' }}>Item 3</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#f5222d' }]}>
            <Text style={{ color: '#fff' }}>Item 4</Text>
          </View>
        </View>
        <Text style={styles.description}>
          使用flexDirection、flexWrap等属性实现灵活的布局。
        </Text>
      </View>

      {/* 边框样式 */}
      <View style={styles.section}>
        <Text style={styles.title}>边框样式</Text>
        <View style={styles.flexContainer}>
          <View style={styles.borderDemo}>
            <Text>圆角边框</Text>
          </View>
          <View style={[styles.borderDemo, { borderStyle: 'dashed' }]}>
            <Text>虚线边框</Text>
          </View>
        </View>
        <Text style={styles.description}>
          可以设置边框宽度、颜色、圆角和样式。
        </Text>
      </View>

      {/* 定位 */}
      <View style={styles.section}>
        <Text style={styles.title}>定位</Text>
        <View style={styles.positionContainer}>
          <View style={[styles.positionedItem, { top: 10, left: 10 }]}>
            <Text style={{ color: '#fff', fontSize: 12 }}>左上</Text>
          </View>
          <View style={[styles.positionedItem, { top: 10, right: 10 }]}>
            <Text style={{ color: '#fff', fontSize: 12 }}>右上</Text>
          </View>
          <View style={[styles.positionedItem, { bottom: 10, left: 10 }]}>
            <Text style={{ color: '#fff', fontSize: 12 }}>左下</Text>
          </View>
          <View style={[styles.positionedItem, { bottom: 10, right: 10 }]}>
            <Text style={{ color: '#fff', fontSize: 12 }}>右下</Text>
          </View>
        </View>
        <Text style={styles.description}>
          使用position、top、right、bottom、left属性进行定位。
        </Text>
      </View>
    </View>
  );
};

export default ViewDemo;
