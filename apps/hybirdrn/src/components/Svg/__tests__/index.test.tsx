import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Svg from '../index';

// 模拟 react-native-svg
vi.mock('react-native-svg', () => {
  return {
    Svg: (props: any) => props.children,
    Path: (props: any) => null,
    Circle: (props: any) => null,
    Rect: (props: any) => null,
    Line: (props: any) => null,
    Ellipse: (props: any) => null,
    Polygon: (props: any) => null,
    Polyline: (props: any) => null,
    G: (props: any) => null,
    Text: (props: any) => null,
  };
});

describe('Svg 组件', () => {
  it('应该正确渲染', () => {
    render(<Svg testID="test-svg" />);
    expect(screen.getByTestId('test-svg')).toBeTruthy();
  });

  it('应该应用自定义宽高', () => {
    render(<Svg width={100} height={100} testID="test-svg" />);
    const svgElement = screen.getByTestId('test-svg');
    expect(svgElement.props.width).toBe(100);
    expect(svgElement.props.height).toBe(100);
  });

  it('应该应用自定义 viewBox', () => {
    render(<Svg viewBox="0 0 100 100" testID="test-svg" />);
    const svgElement = screen.getByTestId('test-svg');
    expect(svgElement.props.viewBox).toBe('0 0 100 100');
  });

  it('应该应用自定义颜色', () => {
    render(<Svg fill="red" stroke="blue" testID="test-svg" />);
    const svgElement = screen.getByTestId('test-svg');
    expect(svgElement.props.fill).toBe('red');
    expect(svgElement.props.stroke).toBe('blue');
  });

  it('应该应用自定义样式', () => {
    render(<Svg style={{ margin: 10 }} testID="test-svg" />);
    const svgElement = screen.getByTestId('test-svg');
    expect(svgElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ margin: 10 })])
    );
  });
});
