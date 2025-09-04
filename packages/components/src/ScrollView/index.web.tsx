import React, { forwardRef, useRef, useEffect } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

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

// ScrollView 组件实现 - Web 版本
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

  const scrollViewRef = useRef<HTMLDivElement>(null);

  // 将 ref 转发到内部的滚动视图
  useEffect(() => {
    if (ref && typeof ref === 'function') {
      ref(scrollViewRef.current);
    } else if (ref) {
      (ref as React.MutableRefObject<any>).current = scrollViewRef.current;
    }
  }, [ref]);

  // 构建样式对象
  const scrollViewStyle: StyleObject = {
    // 基础样式
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...(horizontal ? { overflowX: 'auto', overflowY: 'hidden' } : { overflowX: 'hidden', overflowY: 'auto' }),
    ...(style || {})
  };

  const contentStyle: StyleObject = {
    // 内容样式
    ...(horizontal ? { display: 'flex', flexDirection: 'row' } : {}),
    ...(contentContainerStyle || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: scrollViewStyle,
    h5: {
      // H5 特定样式
      ...(horizontal ? { whiteSpace: 'nowrap' } : {}),
      ...(showsHorizontalScrollIndicator === false && { scrollbarWidth: 'none', msOverflowStyle: 'none' }),
      ...(showsVerticalScrollIndicator === false && { scrollbarWidth: 'none', msOverflowStyle: 'none' }),
      ...(scrollEnabled === false && { overflow: 'hidden' }),
      ...(pagingEnabled && { scrollSnapType: 'x mandatory' })
    }
  });

  const contentStyles = createStyles({
    default: contentStyle,
    h5: {
      // H5 特定样式
      ...(pagingEnabled && { scrollSnapAlign: 'start' })
    }
  });

  // 添加滚动方法到 ref
  useEffect(() => {
    if (ref && typeof ref === 'object') {
      (ref as React.MutableRefObject<any>).current = {
        ...(ref as React.MutableRefObject<any>).current,
        scrollToTop: () => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }
        },
        scrollToEnd: () => {
          if (scrollViewRef.current) {
            const element = scrollViewRef.current;
            if (horizontal) {
              element.scrollTo({
                left: element.scrollWidth,
                behavior: 'smooth'
              });
            } else {
              element.scrollTo({
                top: element.scrollHeight,
                behavior: 'smooth'
              });
            }
          }
        },
        scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              top: options.y || 0,
              left: options.x || 0,
              behavior: options.animated ? 'smooth' : 'auto'
            });
          }
        }
      };
    }
  }, [ref, horizontal]);

  // 事件处理
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(event);
  };

  return (
    <div
      ref={scrollViewRef}
      className={classNames('cross-scroll-view', className)}
      style={styles}
      onScroll={onScroll && handleScroll}
      id={id}
      data-testid={dataTestId || testID}
      {...restProps}
    >
      <div className="cross-scroll-view-content" style={contentStyles}>
        {children}
      </div>
    </div>
  );
});

ScrollView.displayName = 'ScrollView';

export default ScrollView;
