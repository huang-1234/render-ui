import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Platform,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import { defaultSwiperStyles } from './style';

export interface SwiperItem {
  key: string;
  content?: React.ReactNode;
  image?: string;
}

export interface SwiperProps {
  /** 轮播项 */
  items: SwiperItem[];
  /** 是否自动轮播 */
  autoplay?: boolean;
  /** 自动轮播间隔时间（毫秒） */
  interval?: number;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否显示分页指示器 */
  showPagination?: boolean;
  /** 是否显示导航箭头 */
  showNavigation?: boolean;
  /** 当前活动项索引 */
  activeIndex?: number;
  /** 索引变化回调 */
  onChange?: (index: number) => void;
  /** 容器样式 */
  style?: StyleProp<ViewStyle>;
  /** 测试ID */
  testID?: string;
}

const { width: screenWidth } = Dimensions.get('window');

const Swiper: React.FC<SwiperProps> = ({
  items,
  autoplay = true,
  interval = 3000,
  loop = true,
  showPagination = true,
  showNavigation = false,
  activeIndex: propActiveIndex,
  onChange,
  style,
  testID,
}) => {
  const [activeIndex, setActiveIndex] = useState(propActiveIndex || 0);
  const [width, setWidth] = useState(screenWidth);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const componentStyles = useComponentStyles('Swiper', style);

  // 同步外部 activeIndex 变化
  useEffect(() => {
    if (propActiveIndex !== undefined && propActiveIndex !== activeIndex) {
      setActiveIndex(propActiveIndex);
      scrollToIndex(propActiveIndex);
    }
  }, [propActiveIndex]);

  // 处理自动轮播
  useEffect(() => {
    if (autoplay && items.length > 1) {
      startAutoplay();
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, interval, items.length, activeIndex, width]);

  // 开始自动轮播
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    autoplayTimerRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
    }, interval);
  }, [activeIndex, interval, items.length]);

  // 滚动到指定索引
  const scrollToIndex = useCallback((index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * width,
        animated: true,
      });
    }
  }, [width]);

  // 处理滚动结束
  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onChange?.(newIndex);
    }
  }, [activeIndex, width, onChange]);

  // 处理布局变化
  const handleLayout = useCallback((event: any) => {
    const { width: newWidth } = event.nativeEvent.layout;
    setWidth(newWidth);
  }, []);

  // 处理上一项
  const handlePrev = useCallback(() => {
    const newIndex = activeIndex === 0 ? (loop ? items.length - 1 : 0) : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  }, [activeIndex, items.length, loop]);

  // 处理下一项
  const handleNext = useCallback(() => {
    const newIndex = activeIndex === items.length - 1 ? (loop ? 0 : items.length - 1) : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  }, [activeIndex, items.length, loop]);

  // 渲染分页指示器
  const renderPagination = () => {
    if (!showPagination || items.length <= 1) return null;

    return (
      <View style={defaultSwiperStyles.pagination} testID={`${testID}-pagination`}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              index === activeIndex
                ? defaultSwiperStyles.activeDot
                : defaultSwiperStyles.dot
            ]}
            testID={`${testID}-dot-${index}`}
          />
        ))}
      </View>
    );
  };

  // 渲染导航箭头
  const renderNavigation = () => {
    if (!showNavigation || items.length <= 1) return null;

    return (
      <>
        <TouchableOpacity
          style={[defaultSwiperStyles.arrowButton, defaultSwiperStyles.prevButton]}
          onPress={handlePrev}
          testID={`${testID}-prev`}
        >
          <Text style={defaultSwiperStyles.arrowIcon}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[defaultSwiperStyles.arrowButton, defaultSwiperStyles.nextButton]}
          onPress={handleNext}
          testID={`${testID}-next`}
        >
          <Text style={defaultSwiperStyles.arrowIcon}>{'>'}</Text>
        </TouchableOpacity>
      </>
    );
  };

  // 渲染轮播项
  const renderItem = (item: SwiperItem, index: number) => {
    return (
      <View
        key={item.key}
        style={[defaultSwiperStyles.slide, { width }]}
        testID={`${testID}-item-${index}`}
      >
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={defaultSwiperStyles.imageBackground}
            resizeMode="cover"
            testID={`${testID}-image-${index}`}
          />
        )}
        {item.content}
      </View>
    );
  };

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  return (
    <View
      style={[defaultSwiperStyles.container, componentStyles]}
      onLayout={handleLayout}
      {...webProps}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={defaultSwiperStyles.slideContainer}
        contentContainerStyle={{ width: width * items.length }}
        testID={`${testID}-scrollview`}
      >
        {items.map(renderItem)}
      </ScrollView>
      {renderPagination()}
      {renderNavigation()}
    </View>
  );
};

export default Swiper;
