import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from 'vitest';
import Icon from '../index';

describe('Icon 组件', () => {
  it('应该正确渲染', () => {
    render(<Icon name="check-circle" testID="test-icon" />);
    expect(screen.getByTestId('test-icon')).toBeTruthy();
  });

  it('应该应用自定义尺寸', () => {
    render(<Icon name="check-circle" size={32} testID="test-icon" />);
    const iconElement = screen.getByTestId('test-icon');
    expect(iconElement.props.style).toMatchObject({ fontSize: 32 });
  });

  it('应该应用自定义颜色', () => {
    render(<Icon name="check-circle" color="red" testID="test-icon" />);
    const iconElement = screen.getByTestId('test-icon');
    expect(iconElement.props.style).toMatchObject({ color: 'red' });
  });
});
