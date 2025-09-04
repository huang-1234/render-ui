import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultInfiniteScrollStyles from './style';

export interface InfiniteScrollProps {
  /** 加载更多数据的回调函数 */
  loadMore: () => Promise<boolean>; // 返回是否还有更多数据
  /** 是否正在初始加载 */
  initialLoading?: boolean;
  /** 初始加载时显示的组件 */
  initialLoadingComponent?: React.ReactNode;
  /** 加载更多时显示的组件 */
  loadingComponent?: React.ReactNode;
  /** 加载更多时显示的文本 */
  loadingText?: string;
  /** 没有更多数据时显示的组件 */
  endComponent?: React.ReactNode;
  /** 没有更多数据时显示的文本 */
  endMessage?: string;
  /** 加载出错时显示的组件 */
  errorComponent?: React.ReactNode;
  /** 加载出错时显示的文本 */
  errorMessage?: string;
  /** 重试按钮文本 */
  retryText?: string;
  /** 距离底部多远触发加载更多 */
  threshold?: number;
  /** 是否禁用加载更多 */
  disabled?: boolean;
  /** 容器样式 */
  style?: StyleProp<ViewStyle>;
  /** 滚动容器样式 */
  scrollContainerStyle?: StyleProp<ViewStyle>;
  /** 测试ID */
  testID?: string;
  /** 子元素 */
  children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  initialLoading = false,
  initialLoadingComponent,
  loadingComponent,
  loadingText = '加载中...',
  endComponent,
  endMessage = '没有更多数据了',
  errorComponent,
  errorMessage = '加载失败',
  retryText = '重试',
  threshold = 200,
  disabled = false,
  style,
  scrollContainerStyle,
  testID,
  children,
}) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(initialLoading);
  const scrollViewRef = useRef<ScrollView>(null);
  const componentStyles = useComponentStyles('InfiniteScroll', style);

  // 初始加载
  useEffect(() => {
    if (initialLoad) {
      handleLoadMore();
    }
  }, []);

  // 加载更多数据
  const handleLoadMore = useCallback(async () => {
    if (loading || error || !hasMore || disabled) return;

    setLoading(true);
    setError(false);

    try {
      const hasMoreData = await loadMore();
      setHasMore(hasMoreData);
      setInitialLoad(false);
    } catch (err) {
      setError(true);
      console.error('Failed to load more:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, error, hasMore, disabled, loadMore]);

  // 处理滚动事件
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (loading || error || !hasMore || disabled) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = threshold;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      handleLoadMore();
    }
  }, [loading, error, hasMore, disabled, threshold, handleLoadMore]);

  // 处理重试
  const handleRetry = useCallback(() => {
    setError(false);
    handleLoadMore();
  }, [handleLoadMore]);

  // 渲染加载中状态
  const renderLoading = () => {
    if (loadingComponent) return loadingComponent;

    return (
      <View style={defaultInfiniteScrollStyles.loadingContainer} testID={`${testID}-loading`}>
        <ActivityIndicator size="small" color="#999" />
        <Text style={defaultInfiniteScrollStyles.loadingText}>{loadingText}</Text>
      </View>
    );
  };

  // 渲染加载结束状态
  const renderEnd = () => {
    if (!hasMore) {
      if (endComponent) return endComponent;

      return (
        <View style={defaultInfiniteScrollStyles.endMessage} testID={`${testID}-end`}>
          <Text style={defaultInfiniteScrollStyles.endMessageText}>{endMessage}</Text>
        </View>
      );
    }
    return null;
  };

  // 渲染错误状态
  const renderError = () => {
    if (error) {
      if (errorComponent) return errorComponent;

      return (
        <View style={defaultInfiniteScrollStyles.errorContainer} testID={`${testID}-error`}>
          <Text style={defaultInfiniteScrollStyles.errorText}>{errorMessage}</Text>
          <TouchableOpacity
            style={defaultInfiniteScrollStyles.retryButton}
            onPress={handleRetry}
            testID={`${testID}-retry`}
          >
            <Text style={defaultInfiniteScrollStyles.retryButtonText}>{retryText}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  // 渲染初始加载状态
  if (initialLoad) {
    if (initialLoadingComponent) return initialLoadingComponent;

    return (
      <View style={[defaultInfiniteScrollStyles.container, componentStyles]} {...webProps}>
        <View style={defaultInfiniteScrollStyles.loadingContainer} testID={`${testID}-initial-loading`}>
          <ActivityIndicator size="large" color="#999" />
          <Text style={defaultInfiniteScrollStyles.loadingText}>{loadingText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[defaultInfiniteScrollStyles.container, componentStyles]} {...webProps}>
      <ScrollView
        ref={scrollViewRef}
        style={[defaultInfiniteScrollStyles.scrollView, scrollContainerStyle]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        testID={`${testID}-scrollview`}
      >
        {children}
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && renderEnd()}
      </ScrollView>
    </View>
  );
};

export default InfiniteScroll;
