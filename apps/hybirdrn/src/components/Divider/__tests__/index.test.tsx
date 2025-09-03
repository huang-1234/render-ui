import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from 'vitest';
import Divider from '../index';

describe('Divider 组件', () => {
  it('应该正确渲染', () => {
    render(<Divider testID="test-divider" />);
    expect(screen.getByTestId('test-divider')).toBeTruthy();
  });

  it('默认应该渲染水平分割线', () => {
    render(<Divider testID="test-divider" />);
    const dividerElement = screen.getByTestId('test-divider');
    expect(dividerElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ height: 1, width: '100%' })])
    );
  });

  it('当 direction 为 vertical 时应该渲染垂直分割线', () => {
    render(<Divider direction="vertical" testID="test-divider" />);
    const dividerElement = screen.getByTestId('test-divider');
    expect(dividerElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 1, height: '100%' })])
    );
  });

  it('应该应用自定义颜色', () => {
    render(<Divider color="red" testID="test-divider" />);
    const dividerElement = screen.getByTestId('test-divider');
    expect(dividerElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'red' })])
    );
  });

  it('应该应用自定义尺寸', () => {
    render(<Divider size={2} testID="test-divider" />);
    const dividerElement = screen.getByTestId('test-divider');
    expect(dividerElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ height: 2 })])
    );
  });
});
