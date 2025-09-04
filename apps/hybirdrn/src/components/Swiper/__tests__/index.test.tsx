import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Text, View } from 'react-native';
import Swiper from '../index';

const mockItems = [
  { key: '1', content: <Text>Slide 1</Text>, image: 'https://example.com/image1.jpg' },
  { key: '2', content: <Text>Slide 2</Text>, image: 'https://example.com/image2.jpg' },
  { key: '3', content: <Text>Slide 3</Text>, image: 'https://example.com/image3.jpg' },
];

describe('Swiper 组件', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该正确渲染轮播图', () => {
    render(<Swiper items={mockItems} testID="test-swiper" />);
    const swiperElement = screen.getByTestId('test-swiper');
    expect(swiperElement).toBeTruthy();
  });

  it('应该渲染所有轮播项', () => {
    render(<Swiper items={mockItems} testID="test-swiper" />);
    const scrollView = screen.getByTestId('test-swiper-scrollview');
    expect(scrollView.props.children.length).toBe(3);
  });

  it('应该渲染分页指示器', () => {
    render(<Swiper items={mockItems} showPagination={true} testID="test-swiper" />);
    const pagination = screen.getByTestId('test-swiper-pagination');
    expect(pagination).toBeTruthy();
    expect(pagination.props.children.length).toBe(3);
  });

  it('不应该渲染分页指示器', () => {
    render(<Swiper items={mockItems} showPagination={false} testID="test-swiper" />);
    expect(() => screen.getByTestId('test-swiper-pagination')).toThrow();
  });

  it('应该渲染导航箭头', () => {
    render(<Swiper items={mockItems} showNavigation={true} testID="test-swiper" />);
    expect(screen.getByTestId('test-swiper-prev')).toBeTruthy();
    expect(screen.getByTestId('test-swiper-next')).toBeTruthy();
  });

  it('不应该渲染导航箭头', () => {
    render(<Swiper items={mockItems} showNavigation={false} testID="test-swiper" />);
    expect(() => screen.getByTestId('test-swiper-prev')).toThrow();
    expect(() => screen.getByTestId('test-swiper-next')).toThrow();
  });

  it('点击导航箭头应该切换轮播项', () => {
    const onChange = vi.fn();
    render(
      <Swiper
        items={mockItems}
        showNavigation={true}
        onChange={onChange}
        testID="test-swiper"
      />
    );

    const nextButton = screen.getByTestId('test-swiper-next');
    fireEvent.press(nextButton);

    // 模拟滚动结束事件
    const scrollView = screen.getByTestId('test-swiper-scrollview');
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { x: 375, y: 0 }, // 假设屏幕宽度为375
        contentSize: { width: 375 * 3, height: 200 },
        layoutMeasurement: { width: 375, height: 200 },
      },
    });

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('自动轮播应该工作', () => {
    const onChange = vi.fn();
    render(
      <Swiper
        items={mockItems}
        autoplay={true}
        interval={3000}
        onChange={onChange}
        testID="test-swiper"
      />
    );

    // 前进3秒
    vi.advanceTimersByTime(3000);

    // 模拟滚动结束事件
    const scrollView = screen.getByTestId('test-swiper-scrollview');
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { x: 375, y: 0 },
        contentSize: { width: 375 * 3, height: 200 },
        layoutMeasurement: { width: 375, height: 200 },
      },
    });

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('应该渲染图片', () => {
    render(<Swiper items={mockItems} testID="test-swiper" />);
    const image = screen.getByTestId('test-swiper-image-0');
    expect(image).toBeTruthy();
    expect(image.props.source).toEqual({ uri: 'https://example.com/image1.jpg' });
  });
});
