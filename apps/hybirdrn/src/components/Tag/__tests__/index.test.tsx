import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import Tag from '../index';

describe('Tag 组件', () => {
  it('应该正确渲染标签内容', () => {
    render(<Tag testID="test-tag">标签文本</Tag>);
    const tagElement = screen.getByTestId('test-tag');
    expect(tagElement).toBeTruthy();
    expect(tagElement.props.children[0].props.children).toBe('标签文本');
  });

  it('应该应用不同类型的样式', () => {
    render(<Tag type="primary" testID="test-tag">标签文本</Tag>);
    const tagElement = screen.getByTestId('test-tag');
    expect(tagElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: expect.any(String) })])
    );
  });

  it('应该应用不同尺寸的样式', () => {
    render(<Tag size="large" testID="test-tag">标签文本</Tag>);
    const tagElement = screen.getByTestId('test-tag');
    expect(tagElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ paddingVertical: expect.any(Number) })])
    );
  });

  it('应该应用圆角样式', () => {
    render(<Tag round testID="test-tag">标签文本</Tag>);
    const tagElement = screen.getByTestId('test-tag');
    expect(tagElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderRadius: 100 })])
    );
  });

  it('应该渲染关闭按钮并触发关闭事件', () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose} testID="test-tag">
        标签文本
      </Tag>
    );

    const closeButton = screen.getByTestId('test-tag-close');
    expect(closeButton).toBeTruthy();

    fireEvent.press(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
