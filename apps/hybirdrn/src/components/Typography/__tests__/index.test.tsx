import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from 'vitest';
import Typography from '../index';

describe('Typography 组件', () => {
  it('应该正确渲染文本内容', () => {
    render(
      <Typography testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element).toBeTruthy();
    expect(element.props.children).toBe('测试文本');
  });

  it('应该应用类型样式', () => {
    render(
      <Typography type="secondary" testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: expect.any(String) })])
    );
  });

  it('应该应用尺寸样式', () => {
    render(
      <Typography size="lg" testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: expect.any(Number) })])
    );
  });

  it('应该应用粗体样式', () => {
    render(
      <Typography bold testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontWeight: expect.any(String) })])
    );
  });

  it('应该应用斜体样式', () => {
    render(
      <Typography italic testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontStyle: 'italic' })])
    );
  });

  it('应该应用下划线样式', () => {
    render(
      <Typography underline testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'underline' })])
    );
  });

  it('应该应用删除线样式', () => {
    render(
      <Typography delete testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
    );
  });

  it('应该应用居中样式', () => {
    render(
      <Typography center testID="test-typography">测试文本</Typography>
    );
    const element = screen.getByTestId('test-typography');
    expect(element.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textAlign: 'center' })])
    );
  });
});
