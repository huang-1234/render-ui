import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import Picker from '../index';

const mockOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3', disabled: true },
];

describe('Picker 组件', () => {
  it('应该正确渲染选择器', () => {
    render(<Picker options={mockOptions} testID="test-picker" />);
    const pickerElement = screen.getByTestId('test-picker-trigger');
    expect(pickerElement).toBeTruthy();
  });

  it('应该显示占位符文本', () => {
    render(
      <Picker
        options={mockOptions}
        placeholder="请选择一个选项"
        testID="test-picker"
      />
    );
    const pickerText = screen.getByText('请选择一个选项');
    expect(pickerText).toBeTruthy();
  });

  it('应该显示选中的选项', () => {
    render(
      <Picker
        options={mockOptions}
        value="2"
        testID="test-picker"
      />
    );
    const pickerText = screen.getByText('选项2');
    expect(pickerText).toBeTruthy();
  });

  it('应该显示错误状态和错误信息', () => {
    render(
      <Picker
        options={mockOptions}
        error={true}
        errorText="这是一个错误"
        testID="test-picker"
      />
    );

    const errorText = screen.getByTestId('test-picker-error');
    expect(errorText).toBeTruthy();
    expect(errorText.props.children).toBe('这是一个错误');
  });

  it('禁用状态下不应该响应点击', () => {
    const onPress = vi.fn();
    render(
      <Picker
        options={mockOptions}
        disabled={true}
        onPress={onPress}
        testID="test-picker"
      />
    );

    const pickerElement = screen.getByTestId('test-picker-trigger');
    fireEvent.press(pickerElement);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('点击选择器应该打开模态框', () => {
    render(<Picker options={mockOptions} testID="test-picker" />);

    const pickerElement = screen.getByTestId('test-picker-trigger');
    fireEvent.press(pickerElement);

    const modal = screen.getByTestId('test-picker-modal');
    expect(modal).toBeTruthy();
    expect(modal.props.visible).toBe(true);
  });

  it('选择选项后应该触发回调', () => {
    const onChange = vi.fn();
    render(
      <Picker
        options={mockOptions}
        onChange={onChange}
        testID="test-picker"
      />
    );

    // 打开选择器
    const pickerElement = screen.getByTestId('test-picker-trigger');
    fireEvent.press(pickerElement);

    // 选择一个选项
    const option = screen.getByTestId('test-picker-option-2');
    fireEvent.press(option);

    expect(onChange).toHaveBeenCalledWith('2', mockOptions[1]);
  });

  it('不应该选择禁用的选项', () => {
    const onChange = vi.fn();
    render(
      <Picker
        options={mockOptions}
        onChange={onChange}
        testID="test-picker"
      />
    );

    // 打开选择器
    const pickerElement = screen.getByTestId('test-picker-trigger');
    fireEvent.press(pickerElement);

    // 尝试选择禁用的选项
    const disabledOption = screen.getByTestId('test-picker-option-3');
    fireEvent.press(disabledOption);

    expect(onChange).not.toHaveBeenCalled();
  });
});
