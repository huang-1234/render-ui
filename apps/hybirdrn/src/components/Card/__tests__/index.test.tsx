import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Text } from 'react-native';
import Card from '../index';

describe('Card 组件', () => {
  it('应该正确渲染卡片内容', () => {
    render(
      <Card testID="test-card">
        <Text>卡片内容</Text>
      </Card>
    );
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement).toBeTruthy();
  });

  it('应该渲染标题', () => {
    render(
      <Card title="卡片标题" testID="test-card">
        <Text>卡片内容</Text>
      </Card>
    );
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement.props.children[0].props.children[0].props.children[0].props.children).toBe('卡片标题');
  });

  it('应该渲染额外内容', () => {
    render(
      <Card
        title="卡片标题"
        extra={<Text testID="extra-content">额外内容</Text>}
        testID="test-card"
      >
        <Text>卡片内容</Text>
      </Card>
    );
    const extraElement = screen.getByTestId('extra-content');
    expect(extraElement).toBeTruthy();
    expect(extraElement.props.children).toBe('额外内容');
  });

  it('应该渲染页脚', () => {
    render(
      <Card
        footer={<Text testID="footer-content">页脚内容</Text>}
        testID="test-card"
      >
        <Text>卡片内容</Text>
      </Card>
    );
    const footerElement = screen.getByTestId('footer-content');
    expect(footerElement).toBeTruthy();
    expect(footerElement.props.children).toBe('页脚内容');
  });

  it('应该触发点击事件', () => {
    const onPress = vi.fn();
    render(
      <Card onPress={onPress} testID="test-card">
        <Text>卡片内容</Text>
      </Card>
    );

    const cardElement = screen.getByTestId('test-card');
    fireEvent.press(cardElement);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('应该应用边框样式', () => {
    render(
      <Card bordered testID="test-card">
        <Text>卡片内容</Text>
      </Card>
    );
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderWidth: 1 })])
    );
  });

  it('应该应用悬浮样式', () => {
    render(
      <Card hoverable testID="test-card">
        <Text>卡片内容</Text>
      </Card>
    );
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ shadowColor: expect.any(String) })])
    );
  });
});
