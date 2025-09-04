import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Text, View } from 'react-native';
import PullRefresh from '../index';

describe('PullRefresh 组件', () => {
  it('应该正确渲染下拉刷新组件', () => {
    render(
      <PullRefresh onRefresh={async () => {}} testID="test-pullrefresh">
        <Text>内容</Text>
      </PullRefresh>
    );

    const pullRefreshElement = screen.getByTestId('test-pullrefresh');
    expect(pullRefreshElement).toBeTruthy();
    expect(screen.getByText('内容')).toBeTruthy();
  });

  it('应该显示下拉提示文本', () => {
    render(
      <PullRefresh
        onRefresh={async () => {}}
        pullText="自定义下拉文本"
        testID="test-pullrefresh"
      >
        <Text>内容</Text>
      </PullRefresh>
    );

    const indicatorElement = screen.getByTestId('test-pullrefresh-indicator');
    expect(indicatorElement).toBeTruthy();
    expect(screen.getByText('自定义下拉文本')).toBeTruthy();
  });

  it('下拉时应该触发刷新', async () => {
    const onRefresh = vi.fn().mockImplementation(() => Promise.resolve());

    render(
      <PullRefresh
        onRefresh={onRefresh}
        threshold={60}
        testID="test-pullrefresh"
      >
        <Text>内容</Text>
      </PullRefresh>
    );

    const scrollView = screen.getByTestId('test-pullrefresh-scrollview');

    // 模拟下拉超过阈值
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: -70, x: 0 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    });

    // 模拟释放
    fireEvent(scrollView, 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: { y: -70, x: 0 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    });

    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  it('禁用状态下不应该触发刷新', async () => {
    const onRefresh = vi.fn().mockImplementation(() => Promise.resolve());

    render(
      <PullRefresh
        onRefresh={onRefresh}
        disabled={true}
        testID="test-pullrefresh"
      >
        <Text>内容</Text>
      </PullRefresh>
    );

    const scrollView = screen.getByTestId('test-pullrefresh-scrollview');

    // 模拟下拉超过阈值
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: -70, x: 0 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    });

    // 模拟释放
    fireEvent(scrollView, 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: { y: -70, x: 0 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it('应该显示自定义指示器', () => {
    render(
      <PullRefresh
        onRefresh={async () => {}}
        indicator={<View testID="custom-indicator"><Text>自定义指示器</Text></View>}
        testID="test-pullrefresh"
      >
        <Text>内容</Text>
      </PullRefresh>
    );

    expect(screen.getByTestId('custom-indicator')).toBeTruthy();
    expect(screen.getByText('自定义指示器')).toBeTruthy();
  });
});
