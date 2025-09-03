import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { VirtualList } from '../../src/pro-components';
import { Typography, Box, Card } from '../../src/components';

// 模拟数据生成函数
const generateMockData = (count: number, startIndex = 0) => {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    return {
      id: `item-${index}`,
      title: `项目 ${index + 1}`,
      description: `这是项目 ${index + 1} 的描述内容，用于展示瀑布流布局效果。`,
      image: `https://picsum.photos/300/${200 + Math.floor(Math.random() * 300)}?random=${index}`,
      height: 200 + Math.floor(Math.random() * 150),
      color: getRandomColor()
    };
  });
};

// 随机颜色生成函数
const getRandomColor = () => {
  const colors = [
    '#e6f7ff', '#f9f0ff', '#fcf4e6', '#e6fffb',
    '#f6ffed', '#fff7e6', '#fff1f0', '#f0f5ff'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// VirtualList 示例组件
const VirtualListExample = () => {
  const [data, setData] = useState(generateMockData(30));
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 加载更多数据
  const handleLoadMore = useCallback(() => {
    if (loading) return;

    setLoading(true);
    // 模拟网络请求延迟
    setTimeout(() => {
      const newData = generateMockData(20, data.length);
      setData(prevData => [...prevData, ...newData]);
      setLoading(false);
    }, 1500);
  }, [data.length, loading]);

  // 下拉刷新
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // 模拟网络请求延迟
    setTimeout(() => {
      setData(generateMockData(30));
      setRefreshing(false);
    }, 1500);
  }, []);

  // 渲染列表项
  const renderItem = useCallback((item: any, index: number, column: number) => {
    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: item.color }
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={[styles.image, { height: item.height * 0.6 }]}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Typography bold size="md" style={styles.title}>
            {item.title}
          </Typography>
          <Typography type="secondary" size="sm">
            {item.description}
          </Typography>
          <Box row style={styles.meta}>
            <Typography size="xs" type="secondary">
              列 {column + 1} • 高度 {item.height}px
            </Typography>
          </Box>
        </View>
      </Card>
    );
  }, []);

  // 获取项目高度
  const getItemHeight = useCallback((item: any) => {
    // 图片高度 + 内容高度 + 内边距
    return item.height * 0.6 + 100;
  }, []);

  // 渲染列表头部
  const renderHeader = useCallback(() => {
    return (
      <Box style={styles.header}>
        <Typography size="xl" bold center>
          瀑布流布局示例
        </Typography>
        <Typography center type="secondary" style={{ marginTop: 8 }}>
          高性能虚拟化列表，支持懒加载和无限滚动
        </Typography>
      </Box>
    );
  }, []);

  // 渲染列表底部
  const renderFooter = useCallback(() => {
    if (!loading) return null;

    return (
      <Box style={styles.footer}>
        <ActivityIndicator size="large" color="#1890ff" />
        <Typography style={{ marginTop: 8 }}>
          正在加载更多...
        </Typography>
      </Box>
    );
  }, [loading]);

  // 渲染空状态
  const renderEmpty = useCallback(() => {
    return (
      <Box style={styles.empty}>
        <Typography size="lg" type="secondary">
          暂无数据
        </Typography>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Typography>点击刷新</Typography>
        </TouchableOpacity>
      </Box>
    );
  }, [handleRefresh]);

  return (
    <SafeAreaView style={styles.container}>
      <VirtualList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnGap={12}
        getItemHeight={getItemHeight}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={renderEmpty()}
        windowSize={5}
        maxToRenderPerBatch={6}
        initialNumToRender={10}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    marginBottom: 8,
  },
  meta: {
    marginTop: 8,
    justifyContent: 'space-between',
  },
  header: {
    marginVertical: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1890ff',
    borderRadius: 4,
  },
});

export default VirtualListExample;
