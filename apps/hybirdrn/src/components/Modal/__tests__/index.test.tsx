import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Text } from 'react-native';
import Modal from '../index';

describe('Modal 组件', () => {
  it('不可见时不应该渲染内容', () => {
    render(
      <Modal visible={false} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    expect(() => screen.getByTestId('test-modal-content')).toThrow();
  });

  it('可见时应该渲染内容', () => {
    render(
      <Modal visible={true} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const modalContent = screen.getByTestId('test-modal-content');
    expect(modalContent).toBeTruthy();
  });

  it('应该渲染标题', () => {
    render(
      <Modal visible={true} title="测试标题" testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const title = screen.getByText('测试标题');
    expect(title).toBeTruthy();
  });

  it('点击遮罩层应该关闭模态框', () => {
    const onClose = vi.fn();
    render(
      <Modal visible={true} onClose={onClose} maskClosable={true} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const mask = screen.getByTestId('test-modal-mask');
    fireEvent.press(mask);

    expect(onClose).toHaveBeenCalled();
  });

  it('maskClosable 为 false 时点击遮罩层不应该关闭模态框', () => {
    const onClose = vi.fn();
    render(
      <Modal visible={true} onClose={onClose} maskClosable={false} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const mask = screen.getByTestId('test-modal-mask');
    fireEvent.press(mask);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('点击关闭按钮应该关闭模态框', () => {
    const onClose = vi.fn();
    render(
      <Modal visible={true} onClose={onClose} closable={true} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const closeButton = screen.getByTestId('test-modal-close');
    fireEvent.press(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('点击确定按钮应该触发 onOk 回调', () => {
    const onOk = vi.fn();
    render(
      <Modal visible={true} onOk={onOk} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const okButton = screen.getByTestId('test-modal-ok');
    fireEvent.press(okButton);

    expect(onOk).toHaveBeenCalled();
  });

  it('点击取消按钮应该触发 onCancel 和 onClose 回调', () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <Modal visible={true} onCancel={onCancel} onClose={onClose} testID="test-modal">
        <Text>Modal 内容</Text>
      </Modal>
    );

    const cancelButton = screen.getByTestId('test-modal-cancel');
    fireEvent.press(cancelButton);

    expect(onCancel).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('应该使用自定义按钮文本', () => {
    render(
      <Modal
        visible={true}
        okText="确认"
        cancelText="关闭"
        testID="test-modal"
      >
        <Text>Modal 内容</Text>
      </Modal>
    );

    expect(screen.getByText('确认')).toBeTruthy();
    expect(screen.getByText('关闭')).toBeTruthy();
  });

  it('应该渲染自定义页脚', () => {
    render(
      <Modal
        visible={true}
        footer={<Text testID="custom-footer">自定义页脚</Text>}
        testID="test-modal"
      >
        <Text>Modal 内容</Text>
      </Modal>
    );

    expect(screen.getByTestId('custom-footer')).toBeTruthy();
    expect(() => screen.getByTestId('test-modal-ok')).toThrow();
  });

  it('footer 为 null 时不应该渲染页脚', () => {
    render(
      <Modal
        visible={true}
        footer={null}
        testID="test-modal"
      >
        <Text>Modal 内容</Text>
      </Modal>
    );

    expect(() => screen.getByTestId('test-modal-ok')).toThrow();
  });
});
