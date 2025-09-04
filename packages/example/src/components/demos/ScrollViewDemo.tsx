import React, { useRef } from 'react';
import { View, Text, ScrollView, Button, createStyles } from '@cross-platform/components';

const ScrollViewDemo: React.FC = () => {
  const verticalScrollViewRef = useRef<any>(null);
  const horizontalScrollViewRef = useRef<any>(null);

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
    verticalScrollView: {
      height: 200,
      backgroundColor: '#f5f5f5',
      borderRadius: 8
    },
    horizontalScrollView: {
      height: 120,
      backgroundColor: '#f5f5f5',
      borderRadius: 8
    },
    scrollItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e8e8e8'
    },
    horizontalScrollItem: {
      width: 150,
      height: 100,
      margin: 10,
      backgroundColor: '#1890ff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8
    },
    horizontalScrollItemText: {
      color: '#ffffff',
      fontWeight: '500' as any
    },
    controlButtons: {
      flexDirection: 'row',
      marginTop: 10
    },
    controlButton: {
      marginRight: 10
    }
  });

  // 生成垂直滚动项
  const renderVerticalItems = () => {
    return Array.from({ length: 20 }).map((_, index) => (
      <View key={index} style={styles.scrollItem}>
        <Text>滚动项 {index + 1}</Text>
      </View>
    ));
  };

  // 生成水平滚动项
  const renderHorizontalItems = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <View key={index} style={styles.horizontalScrollItem}>
        <Text style={styles.horizontalScrollItemText}>项目 {index + 1}</Text>
      </View>
    ));
  };

  // 滚动到顶部
  const scrollToTop = () => {
    verticalScrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // 滚动到底部
  const scrollToBottom = () => {
    verticalScrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // 水平滚动到开始
  const scrollToStart = () => {
    horizontalScrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  // 水平滚动到结束
  const scrollToEnd = () => {
    horizontalScrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View>
      {/* 垂直滚动 */}
      <View style={styles.section}>
        <Text style={styles.title}>垂直滚动</Text>
        <View style={styles.demoContainer}>
          <ScrollView
            ref={verticalScrollViewRef}
            style={styles.verticalScrollView}
            showsVerticalScrollIndicator={true}
          >
            {renderVerticalItems()}
          </ScrollView>
          <View style={styles.controlButtons}>
            <Button
              type="primary"
              size="small"
              style={styles.controlButton}
              onPress={scrollToTop}
            >
              滚动到顶部
            </Button>
            <Button
              type="primary"
              size="small"
              style={styles.controlButton}
              onPress={scrollToBottom}
            >
              滚动到底部
            </Button>
          </View>
        </View>
        <Text style={styles.description}>
          垂直滚动的ScrollView，可以通过ref控制滚动位置。
        </Text>
      </View>

      {/* 水平滚动 */}
      <View style={styles.section}>
        <Text style={styles.title}>水平滚动</Text>
        <View style={styles.demoContainer}>
          <ScrollView
            ref={horizontalScrollViewRef}
            horizontal={true}
            style={styles.horizontalScrollView}
            showsHorizontalScrollIndicator={true}
          >
            {renderHorizontalItems()}
          </ScrollView>
          <View style={styles.controlButtons}>
            <Button
              type="primary"
              size="small"
              style={styles.controlButton}
              onPress={scrollToStart}
            >
              滚动到开始
            </Button>
            <Button
              type="primary"
              size="small"
              style={styles.controlButton}
              onPress={scrollToEnd}
            >
              滚动到结束
            </Button>
          </View>
        </View>
        <Text style={styles.description}>
          水平滚动的ScrollView，可以通过ref控制滚动位置。
        </Text>
      </View>

      {/* 滚动事件 */}
      <View style={styles.section}>
        <Text style={styles.title}>滚动事件</Text>
        <View style={styles.demoContainer}>
          <ScrollView
            style={[styles.verticalScrollView, { height: 150 }]}
            onScroll={(event) => {
              // 获取滚动位置
              const offsetY = event.nativeEvent?.contentOffset?.y;
              console.log('Scroll position:', offsetY);
            }}
            scrollEventThrottle={16} // 每16ms触发一次滚动事件
          >
            {renderVerticalItems().slice(0, 10)}
          </ScrollView>
        </View>
        <Text style={styles.description}>
          ScrollView提供onScroll事件，可以获取滚动位置信息。scrollEventThrottle属性可以控制事件触发频率。
        </Text>
      </View>

      {/* 其他属性 */}
      <View style={styles.section}>
        <Text style={styles.title}>其他属性</Text>
        <View style={styles.demoContainer}>
          <ScrollView
            style={[styles.verticalScrollView, { height: 150 }]}
            bounces={false} // 禁用弹性效果
            scrollEnabled={true} // 启用滚动
            pagingEnabled={false} // 禁用分页
          >
            {renderVerticalItems().slice(0, 10)}
          </ScrollView>
        </View>
        <Text style={styles.description}>
          ScrollView还支持bounces（是否启用弹性效果）、scrollEnabled（是否可滚动）、pagingEnabled（是否启用分页）等属性。
        </Text>
      </View>
    </View>
  );
};

export default ScrollViewDemo;
