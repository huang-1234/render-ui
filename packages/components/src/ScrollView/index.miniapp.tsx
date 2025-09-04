import React, { forwardRef, useRef, useEffect } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';

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

// ScrollView 组件实现 - 小程序版本
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

  // 构建样式对象
  const styles = createStyles({
    default: {
      ...(style || {})
    }
  });

  const contentStyles = createStyles({
    default: {
      ...(contentContainerStyle || {})
    }
  });

  // 事件处理
  const handleScroll = (event: any) => {
    onScroll?.(event);
  };

  // 小程序特定属性
  const scrollViewProps: any = {
    scrollX: horizontal,
    scrollY: !horizontal,
    showScrollbar: horizontal ? showsHorizontalScrollIndicator : showsVerticalScrollIndicator,
    enhanced: true,
    bounces,
    pagingEnabled,
    scrollWithAnimation: true,
    onScroll: onScroll && handleScroll,
    className: classNames('cross-scroll-view', className),
    style: styles,
    ...restProps
  };

  // 适配 Taro 的属性名
  if ('scroll-x' in scrollViewProps) {
    scrollViewProps.scrollX = scrollViewProps['scroll-x'];
    delete scrollViewProps['scroll-x'];
  }

  if ('scroll-y' in scrollViewProps) {
    scrollViewProps.scrollY = scrollViewProps['scroll-y'];
    delete scrollViewProps['scroll-y'];
  }

  if ('show-scrollbar' in scrollViewProps) {
    scrollViewProps.showScrollbar = scrollViewProps['show-scrollbar'];
    delete scrollViewProps['show-scrollbar'];
  }

  if ('paging-enabled' in scrollViewProps) {
    scrollViewProps.pagingEnabled = scrollViewProps['paging-enabled'];
    delete scrollViewProps['paging-enabled'];
  }

  if ('scroll-with-animation' in scrollViewProps) {
    scrollViewProps.scrollWithAnimation = scrollViewProps['scroll-with-animation'];
    delete scrollViewProps['scroll-with-animation'];
  }

  // 由于 TypeScript 不识别小程序标签，我们需要使用 JSX.Element 类型
  return React.createElement(
    'scroll-view',
    {
      ref: scrollViewRef,
      ...scrollViewProps
    },
    React.createElement(
      View,
      { className: "cross-scroll-view-content", style: contentStyles },
      children
    )
  );
});

ScrollView.displayName = 'ScrollView';

export default ScrollView;
