import React, { forwardRef, useRef, useEffect } from 'react';
import { StyleObject } from '@cross-platform/core';
import { ScrollView as RNScrollView } from 'react-native';

// ScrollView 组件属性接口
export interface ScrollViewProps {
  children?: React.ReactNode;
  style?: StyleObject;
  contentContainerStyle?: StyleObject;
  className?: string;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  scrollEnabled?: boolean;
  bounces?: boolean;
  pagingEnabled?: boolean;
  scrollEventThrottle?: number;
  onScroll?: (event: any) => void;
  onScrollBeginDrag?: (event: any) => void;
  onScrollEndDrag?: (event: any) => void;
  onMomentumScrollBegin?: (event: any) => void;
  onMomentumScrollEnd?: (event: any) => void;
  onContentSizeChange?: (width: number, height: number) => void;
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// ScrollView 组件实现 - React Native 版本
const ScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
  const {
    children,
    style,
    contentContainerStyle,
    className,
    horizontal = false,
    showsHorizontalScrollIndicator = true,
    showsVerticalScrollIndicator = true,
    scrollEnabled = true,
    bounces = true,
    pagingEnabled = false,
    scrollEventThrottle = 16,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onContentSizeChange,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  const scrollViewRef = useRef<any>(null);

  // 将 ref 转发到内部的滚动视图
  useEffect(() => {
    if (ref && typeof ref === 'function') {
      ref(scrollViewRef.current);
    } else if (ref) {
      (ref as React.MutableRefObject<any>).current = scrollViewRef.current;
    }
  }, [ref]);

  // 添加滚动方法到 ref
  useEffect(() => {
    if (ref && typeof ref === 'object') {
      (ref as React.MutableRefObject<any>).current = {
        ...(ref as React.MutableRefObject<any>).current,
        scrollToTop: () => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        },
        scrollToEnd: () => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        },
        scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => {
          scrollViewRef.current?.scrollTo({
            x: options.x || 0,
            y: options.y || 0,
            animated: options.animated !== false
          });
        }
      };
    }
  }, [ref]);

  return (
    <RNScrollView
      ref={scrollViewRef}
      style={style}
      contentContainerStyle={contentContainerStyle}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      scrollEnabled={scrollEnabled}
      bounces={bounces}
      pagingEnabled={pagingEnabled}
      scrollEventThrottle={scrollEventThrottle}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onContentSizeChange={onContentSizeChange}
      testID={testID}
      {...restProps}
    >
      {children}
    </RNScrollView>
  );
});

ScrollView.displayName = 'ScrollView';

export default ScrollView;