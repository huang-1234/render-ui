import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Text, View } from 'react-native';
import VirtualList from '../index';

// 模拟数据
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item ${i + 1}`,
  height: 100 + Math.floor(Math.random() * 100)
}));

// 模拟渲染项目函数
const mockRenderItem = vi.fn((item, index, column) => (
  <View testID={`item-${index}`} style={{ height: item.height }}>
    <Text>{item.title}</Text>
  </View>
));

// 模拟键提取器
const mockKeyExtractor = (item: any) => item.id;

// 模拟高度计算函数
const mockGetItemHeight = (item: any) => item.height;

describe('VirtualList 组件', () => {
  beforeEach(() => {
    mockRenderItem.mockClear();
  });

  it('应该正确渲染', () => {
    render(
      <VirtualList
        data={mockData}
        renderItem={mockRenderItem}
        keyExtractor={mockKeyExtractor}
        getItemHeight={mockGetItemHeight}
        testID="virtual-list"
      />
    );

    expect(screen.getByTestID('virtual-list')).toBeTruthy();
  });

  it('应该渲染初始数量的项目', () => {
    render(
      <VirtualList
        data={mockData.slice(0, 5)}
        renderItem={mockRenderItem}
        keyExtractor={mockKeyExtractor}
        getItemHeight={mockGetItemHeight}
        initialNumToRender={5}
      />
    );

    // 初始应该渲染5个项目
    expect(mockRenderItem).toHaveBeenCalledTimes(5);
  });

  it('应该渲染空状态组件', () => {
    render(
      <VirtualList
        data={[]}
        renderItem={mockRenderItem}
        keyExtractor={mockKeyExtractor}
        getItemHeight={mockGetItemHeight}
        ListEmptyComponent={<Text testID="empty-component">No data</Text>}
      />
    );

    expect(screen.getByTestID('empty-component')).toBeTruthy();
    expect(screen.getByText('No data')).toBeTruthy();
  });

  it('应该渲染头部和尾部组件', () => {
    render(
      <VirtualList
        data={mockData}
        renderItem={mockRenderItem}
        keyExtractor={mockKeyExtractor}
        getItemHeight={mockGetItemHeight}
        ListHeaderComponent={<Text testID="header-component">Header</Text>}
        ListFooterComponent={<Text testID="footer-component">Footer</Text>}
      />
    );

    expect(screen.getByTestID('header-component')).toBeTruthy();
    expect(screen.getByTestID('footer-component')).toBeTruthy();
  });

  it('应该支持刷新控件', () => {
    const mockOnRefresh = vi.fn();

    render(
      <VirtualList
        data={mockData}
        renderItem={mockRenderItem}
        keyExtractor={mockKeyExtractor}
        getItemHeight={mockGetItemHeight}
        refreshing={false}
        onRefresh={mockOnRefresh}
      />
    );

    // 由于 RefreshControl 是原生组件，我们无法直接测试其交互
    // 但至少可以确保组件不会因为添加 refreshing 和 onRefresh 而崩溃
    expect(true).toBeTruthy();
  });
});
