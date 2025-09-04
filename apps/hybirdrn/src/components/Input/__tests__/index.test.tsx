import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import Input from '../index';

describe('Input 组件', () => {
  it('应该正确渲染输入框', () => {
    render(<Input testID="test-input" placeholder="请输入" />);
    const inputElement = screen.getByTestId('test-input-input');
    expect(inputElement).toBeTruthy();
    expect(inputElement.props.placeholder).toBe('请输入');
  });

  it('应该响应文本变化', () => {
    const onChangeText = vi.fn();
    render(<Input testID="test-input" onChangeText={onChangeText} />);
    const inputElement = screen.getByTestId('test-input-input');

    fireEvent.changeText(inputElement, 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('应该显示错误状态和错误信息', () => {
    render(
      <Input
        testID="test-input"
        error={true}
        errorText="这是一个错误"
      />
    );

    const errorText = screen.getByTestId('test-input-error');
    expect(errorText).toBeTruthy();
    expect(errorText.props.children).toBe('这是一个错误');
  });

  it('应该支持清除功能', () => {
    const onClear = vi.fn();
    const onChangeText = vi.fn();

    render(
      <Input
        testID="test-input"
        value="测试文本"
        clearable={true}
        onClear={onClear}
        onChangeText={onChangeText}
      />
    );

    const clearButton = screen.getByTestId('test-input-clear');
    expect(clearButton).toBeTruthy();

    fireEvent.press(clearButton);
    expect(onClear).toHaveBeenCalled();
    expect(onChangeText).toHaveBeenCalledWith('');
  });

  it('禁用状态下不应该可编辑', () => {
    render(<Input testID="test-input" disabled={true} />);
    const inputElement = screen.getByTestId('test-input-input');
    expect(inputElement.props.editable).toBe(false);
  });

  it('应该支持前缀和后缀', () => {
    render(
      <Input
        testID="test-input"
        prefix={<div data-testid="test-prefix">前缀</div>}
        suffix={<div data-testid="test-suffix">后缀</div>}
      />
    );

    expect(screen.getByTestId('test-prefix')).toBeTruthy();
    expect(screen.getByTestId('test-suffix')).toBeTruthy();
  });

  it('应该支持多行文本', () => {
    render(<Input testID="test-input" textarea={true} maxRows={5} />);
    const inputElement = screen.getByTestId('test-input-input');
    expect(inputElement.props.multiline).toBe(true);
    expect(inputElement.props.numberOfLines).toBe(5);
  });
});
