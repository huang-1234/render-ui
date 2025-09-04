import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultPullRefreshStyles from './style';

export interface PullRefreshProps {
  /** 刷新回调函数 */
  onRefresh: () => Promise<void>;
  /** 下拉阈值，超过后触发刷新 */
  threshold?: number;
  /** 最大下拉距离 */
  maxPullDistance?: number;
  /** 下拉提示文本 */
  pullText?: string;
  /** 释放刷新文本 */
  releaseText?: string;
  /** 刷新中文本 */
  refreshingText?: string;
  /** 自定义下拉指示器 */
  indicator?: React.ReactNode;
  /** 是否禁用下拉刷新 */
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

const PullRefresh: React.FC<PullRefreshProps> = ({
  onRefresh,
  threshold = 60,
  maxPullDistance = 100,
  pullText = '下拉刷新',
  releaseText = '释放刷新',
  refreshingText = '刷新中...',
  indicator,
  disabled = false,
  style,
  scrollContainerStyle,
  testID,
  children,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const componentStyles = useComponentStyles('PullRefresh', style);

  // 处理滚动事件
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled || refreshing) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      // 计算下拉距离
      const distance = Math.min(Math.abs(offsetY), maxPullDistance);
      setPullDistance(distance);
    } else {
      setPullDistance(0);
    }
  }, [disabled, refreshing, maxPullDistance]);

  // 处理滚动结束
  const handleScrollEnd = useCallback(async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled || refreshing) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= -threshold) {
      // 触发刷新
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
        // 滚动回顶部
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    }
  }, [disabled, refreshing, threshold, onRefresh]);

  // 获取刷新状态文本
  const getRefreshText = useCallback(() => {
    if (refreshing) {
      return refreshingText;
    }
    return pullDistance >= threshold ? releaseText : pullText;
  }, [refreshing, pullDistance, threshold, pullText, releaseText, refreshingText]);

  // 渲染刷新指示器
  const renderRefreshIndicator = () => {
    if (indicator) return indicator;

    return (
      <View style={defaultPullRefreshStyles.refreshContent}>
        {refreshing ? (
          <ActivityIndicator size="small" color="#999" />
        ) : (
          <Animated.Text
            style={[
              defaultPullRefreshStyles.arrowIcon,
              pullDistance >= threshold && defaultPullRefreshStyles.arrowIconRotated,
            ]}
          >
            ↓
          </Animated.Text>
        )}
        <Text style={defaultPullRefreshStyles.refreshText}>{getRefreshText()}</Text>
      </View>
    );
  };

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  return (
    <View style={[defaultPullRefreshStyles.container, componentStyles]} {...webProps}>
      <Animated.View
        style={[
          defaultPullRefreshStyles.refreshContainer,
          { transform: [{ translateY: Animated.multiply(scrollY, -1) }] },
        ]}
        testID={`${testID}-indicator`}
      >
        {renderRefreshIndicator()}
      </Animated.View>

      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        onScrollEndDrag={handleScrollEnd}
        style={scrollContainerStyle}
        testID={`${testID}-scrollview`}
      >
        {children}

        {refreshing && (
          <View style={defaultPullRefreshStyles.loadingContainer} testID={`${testID}-loading`}>
            <ActivityIndicator size="small" color="#999" />
            <Text style={defaultPullRefreshStyles.loadingText}>{refreshingText}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PullRefresh;
