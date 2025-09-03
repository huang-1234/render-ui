import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  StyleProp,
  ViewStyle,
  RefreshControl,
  Text,
  ActivityIndicator
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultVirtualListStyles from './style';
import { throttle } from '../../utils/performanceUtils';
import { WaterfallLayoutCalculator } from '../../utils/waterfallLayout';

/**
 * VirtualList 组件属性接口
 */
export interface VirtualListProps<T> {
  // 数据源
  data: T[];
  // 项目渲染函数
  renderItem: (item: T, index: number, column: number) => React.ReactNode;
  // 键提取器
  keyExtractor: (item: T, index: number) => string;
  // 布局配置
  numColumns?: number;
  columnWidth?: number;
  columnGap?: number;
  // 性能配置
  windowSize?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  initialNumToRender?: number;
  // 滚动配置
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  // 刷新配置
  refreshing?: boolean;
  onRefresh?: () => void;
  // 样式
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  // 瀑布流配置
  enableWaterfall?: boolean;
  getItemHeight?: (item: T, index: number) => number | Promise<number>;
  // FlatList 兼容参数
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  horizontal?: boolean;
}

/**
 * 布局信息接口
 */
interface LayoutInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
}

/**
 * VirtualList 组件
 * 高性能虚拟化列表，支持瀑布流布局
 */
const VirtualList = <T,>({
  data,
  renderItem,
  keyExtractor,
  numColumns = 2,
  columnWidth,
  columnGap = 8,
  windowSize = 21,
  maxToRenderPerBatch = 10,
  updateCellsBatchingPeriod = 50,
  initialNumToRender = 10,
  onEndReached,
  onEndReachedThreshold = 0.5,
  onScroll,
  refreshing = false,
  onRefresh,
  style,
  contentContainerStyle,
  enableWaterfall = true,
  getItemHeight,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  horizontal = false
}: VirtualListProps<T>) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [itemLayouts, setItemLayouts] = useState<Map<string, LayoutInfo>>(new Map());
  const [contentHeight, setContentHeight] = useState(0);
  const [isLayoutCalculated, setIsLayoutCalculated] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const hasCalledOnEndReached = useRef(false);
  const componentStyles = useComponentStyles('VirtualList', style);

  // 计算列宽
  const calculatedColumnWidth = useMemo(() => {
    if (columnWidth) return columnWidth;
    if (containerWidth === 0) return 0;
    return (containerWidth - (numColumns - 1) * columnGap) / numColumns;
  }, [numColumns, columnGap, columnWidth, containerWidth]);

  // 瀑布流布局算法
  const calculateLayout = useCallback(async () => {
    if (data.length === 0) {
      setItemLayouts(new Map());
      setContentHeight(0);
      setIsLayoutCalculated(true);
      return 0;
    }

    if (containerWidth === 0) {
      return 0;
    }

    const newLayouts = new Map<string, LayoutInfo>();
    const calculator = new WaterfallLayoutCalculator(
      numColumns,
      containerWidth,
      columnGap
    );

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const key = keyExtractor(item, i);

      // 获取项目高度（支持异步获取）
      let itemHeight = 100; // 默认高度
      if (getItemHeight) {
        try {
          const height = getItemHeight(item, i);
          itemHeight = typeof height === 'number' ? height : await height;
        } catch (error) {
          console.warn('Error calculating item height:', error);
        }
      }

      // 使用瀑布流计算器添加项目
      const layout = calculator.addItem(itemHeight);
      newLayouts.set(key, layout);
    }

    setItemLayouts(newLayouts);
    const totalHeight = calculator.getTotalHeight();
    setContentHeight(totalHeight);
    setIsLayoutCalculated(true);
    return totalHeight;
  }, [data, numColumns, columnGap, containerWidth, getItemHeight, keyExtractor]);

  // 计算可见项目范围
  const visibleRange = useMemo(() => {
    if (containerHeight === 0 || !isLayoutCalculated) {
      return { start: 0, end: Math.min(initialNumToRender, data.length - 1) };
    }

    const startY = Math.max(0, scrollOffset - windowSize * containerHeight / 21);
    const endY = scrollOffset + containerHeight + windowSize * containerHeight / 21;

    let startIndex = data.length - 1;
    let endIndex = 0;

    // 查找可见范围内的项目
    data.forEach((item, index) => {
      const key = keyExtractor(item, index);
      const layout = itemLayouts.get(key);

      if (layout) {
        if (layout.y <= endY && layout.y + layout.height >= startY) {
          startIndex = Math.min(startIndex, index);
          endIndex = Math.max(endIndex, index);
        }
      }
    });

    // 如果找不到可见项目，返回初始范围
    if (startIndex > endIndex) {
      return { start: 0, end: Math.min(initialNumToRender, data.length - 1) };
    }

    // 扩展可见范围，确保平滑滚动
    return {
      start: Math.max(0, startIndex - maxToRenderPerBatch),
      end: Math.min(data.length - 1, endIndex + maxToRenderPerBatch)
    };
  }, [
    scrollOffset,
    containerHeight,
    data,
    itemLayouts,
    windowSize,
    maxToRenderPerBatch,
    initialNumToRender,
    keyExtractor,
    isLayoutCalculated
  ]);

  // 处理滚动事件（使用节流优化）
  const handleScroll = useCallback(
    throttle((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setScrollOffset(offsetY);
      onScroll?.(event);

      // 检查是否到达底部
      if (onEndReached && containerHeight > 0 && !hasCalledOnEndReached.current) {
        const contentHeight = event.nativeEvent.contentSize.height;
        if (
          offsetY + containerHeight >=
          contentHeight - contentHeight * onEndReachedThreshold
        ) {
          hasCalledOnEndReached.current = true;
          onEndReached();
        }
      } else if (
        containerHeight > 0 &&
        event.nativeEvent.contentOffset.y + containerHeight <
          event.nativeEvent.contentSize.height -
          event.nativeEvent.contentSize.height * onEndReachedThreshold
      ) {
        // 重置标志，当用户向上滚动时
        hasCalledOnEndReached.current = false;
      }
    }, 16),
    [onScroll, onEndReached, containerHeight, onEndReachedThreshold]
  );

  // 处理容器布局变化
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setContainerHeight(height);
    setContainerWidth(width);
  }, []);

  // 初始化布局计算
  useEffect(() => {
    if (containerWidth > 0) {
      calculateLayout();
    }
  }, [calculateLayout, containerWidth, data]);

  // 渲染可见项目
  const renderVisibleItems = useCallback(() => {
    if (!isLayoutCalculated) return null;

    const { start, end } = visibleRange;
    const visibleItems = [];

    for (let i = start; i <= end; i++) {
      if (i >= data.length) continue;

      const item = data[i];
      const key = keyExtractor(item, i);
      const layout = itemLayouts.get(key);

      if (layout) {
        visibleItems.push(
          <View
            key={key}
            style={[
              defaultVirtualListStyles.item,
              {
                position: 'absolute',
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height
              }
            ]}
          >
            {renderItem(item, i, layout.column)}
          </View>
        );
      }
    }

    return visibleItems;
  }, [data, visibleRange, itemLayouts, renderItem, keyExtractor, isLayoutCalculated]);

  // 渲染空状态
  const renderEmptyComponent = useCallback(() => {
    if (data.length === 0 && ListEmptyComponent) {
      return ListEmptyComponent;
    }
    return null;
  }, [data.length, ListEmptyComponent]);

  return (
    <View
      style={[defaultVirtualListStyles.container, componentStyles]}
      onLayout={handleLayout}
    >
      <ScrollView
        ref={scrollViewRef}
        style={defaultVirtualListStyles.scrollView}
        contentContainerStyle={[
          defaultVirtualListStyles.contentContainer,
          { height: contentHeight },
          contentContainerStyle
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={Platform.OS !== 'web'}
        showsVerticalScrollIndicator={true}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : undefined
        }
      >
        {ListHeaderComponent}
        {renderVisibleItems()}
        {renderEmptyComponent()}
        {ListFooterComponent}
      </ScrollView>

      {!isLayoutCalculated && (
        <View style={defaultVirtualListStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

export default VirtualList;
