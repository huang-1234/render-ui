import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Text, View } from 'react-native';
import InfiniteScroll from '../index';

describe('InfiniteScroll 组件', () => {
  it('应该正确渲染无限滚动组件', () => {
    render(
      <InfiniteScroll loadMore={async () => true} testID="test-infinite">
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const infiniteScrollElement = screen.getByTestId('test-infinite');
    expect(infiniteScrollElement).toBeTruthy();
    expect(screen.getByText('内容')).toBeTruthy();
  });

  it('初始加载时应该显示加载状态', () => {
    render(
      <InfiniteScroll
        loadMore={async () => true}
        initialLoading={true}
        testID="test-infinite"
      >
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const loadingElement = screen.getByTestId('test-infinite-initial-loading');
    expect(loadingElement).toBeTruthy();
    expect(() => screen.getByText('内容')).toThrow();
  });

  it('滚动到底部时应该加载更多', async () => {
    const loadMore = vi.fn().mockImplementation(() => Promise.resolve(true));

    render(
      <InfiniteScroll
        loadMore={loadMore}
        threshold={200}
        testID="test-infinite"
      >
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const scrollView = screen.getByTestId('test-infinite-scrollview');

    // 模拟滚动到底部
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 800, x: 0 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 300, width: 100 },
      },
    });

    await waitFor(() => {
      expect(loadMore).toHaveBeenCalled();
    });
  });

  it('加载出错时应该显示错误信息和重试按钮', async () => {
    const loadMore = vi.fn().mockImplementation(() => Promise.reject(new Error('加载失败')));

    render(
      <InfiniteScroll
        loadMore={loadMore}
        errorMessage="自定义错误信息"
        retryText="重新加载"
        testID="test-infinite"
      >
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const scrollView = screen.getByTestId('test-infinite-scrollview');

    // 模拟滚动到底部
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 800, x: 0 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 300, width: 100 },
      },
    });

    await waitFor(() => {
      const errorElement = screen.getByTestId('test-infinite-error');
      expect(errorElement).toBeTruthy();
      expect(screen.getByText('自定义错误信息')).toBeTruthy();
      expect(screen.getByText('重新加载')).toBeTruthy();
    });
  });

  it('点击重试按钮应该重新加载', async () => {
    const loadMore = vi.fn()
      .mockImplementationOnce(() => Promise.reject(new Error('加载失败')))
      .mockImplementationOnce(() => Promise.resolve(true));

    render(
      <InfiniteScroll
        loadMore={loadMore}
        testID="test-infinite"
      >
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const scrollView = screen.getByTestId('test-infinite-scrollview');

    // 模拟滚动到底部
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 800, x: 0 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 300, width: 100 },
      },
    });

    await waitFor(() => {
      const retryButton = screen.getByTestId('test-infinite-retry');
      expect(retryButton).toBeTruthy();

      fireEvent.press(retryButton);
    });

    await waitFor(() => {
      expect(loadMore).toHaveBeenCalledTimes(2);
    });
  });

  it('没有更多数据时应该显示结束信息', async () => {
    const loadMore = vi.fn().mockImplementation(() => Promise.resolve(false));

    render(
      <InfiniteScroll
        loadMore={loadMore}
        endMessage="已经到底了"
        testID="test-infinite"
      >
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const scrollView = screen.getByTestId('test-infinite-scrollview');

    // 模拟滚动到底部
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 800, x: 0 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 300, width: 100 },
      },
    });

    await waitFor(() => {
      const endElement = screen.getByTestId('test-infinite-end');
      expect(endElement).toBeTruthy();
      expect(screen.getByText('已经到底了')).toBeTruthy();
    });
  });

  it('禁用状态下不应该加载更多', async () => {
    const loadMore = vi.fn().mockImplementation(() => Promise.resolve(true));

    render(
      <InfiniteScroll
        loadMore={loadMore}
        disabled={true}
        testID="test-infinite"
      >
        <Text>内容</Text>
      </InfiniteScroll>
    );

    const scrollView = screen.getByTestId('test-infinite-scrollview');

    // 模拟滚动到底部
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 800, x: 0 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 300, width: 100 },
      },
    });

    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(loadMore).not.toHaveBeenCalled();
  });
});
