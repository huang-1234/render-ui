import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { Text } from 'react-native';
import SideBar from '../index';

describe('SideBar 组件', () => {
  it('当 visible 为 false 时不应该渲染', () => {
    render(
      <SideBar
        visible={false}
        items={[{ key: '1', title: '菜单项1' }]}
        testID="test-sidebar"
      />
    );

    expect(() => screen.getByTestId('test-sidebar')).toThrow();
  });

  it('当 visible 为 true 时应该渲染', () => {
    render(
      <SideBar
        visible={true}
        items={[{ key: '1', title: '菜单项1' }]}
        testID="test-sidebar"
      />
    );

    expect(screen.getByTestId('test-sidebar')).toBeTruthy();
  });

  it('应该渲染标题', () => {
    render(
      <SideBar
        visible={true}
        title="测试标题"
        items={[{ key: '1', title: '菜单项1' }]}
        testID="test-sidebar"
      />
    );

    const sidebarContent = screen.getByTestId('test-sidebar-content');
    expect(sidebarContent).toBeTruthy();

    // 查找标题文本
    const headerTitle = screen.getByText('测试标题');
    expect(headerTitle).toBeTruthy();
  });

  it('应该渲染菜单项', () => {
    render(
      <SideBar
        visible={true}
        items={[
          { key: '1', title: '菜单项1' },
          { key: '2', title: '菜单项2' }
        ]}
        testID="test-sidebar"
      />
    );

    expect(screen.getByText('菜单项1')).toBeTruthy();
    expect(screen.getByText('菜单项2')).toBeTruthy();
  });

  it('应该高亮显示激活的菜单项', () => {
    render(
      <SideBar
        visible={true}
        items={[
          { key: '1', title: '菜单项1' },
          { key: '2', title: '菜单项2' }
        ]}
        activeKey="2"
        testID="test-sidebar"
      />
    );

    const activeItem = screen.getByTestId('test-sidebar-item-2');
    expect(activeItem.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: expect.any(String),
          borderLeftWidth: expect.any(Number)
        })
      ])
    );
  });

  it('点击菜单项时应该触发回调', () => {
    const onItemPress = vi.fn();
    const itemOnPress = vi.fn();

    render(
      <SideBar
        visible={true}
        items={[
          { key: '1', title: '菜单项1', onPress: itemOnPress }
        ]}
        onItemPress={onItemPress}
        testID="test-sidebar"
      />
    );

    const menuItem = screen.getByTestId('test-sidebar-item-1');
    fireEvent.press(menuItem);

    expect(onItemPress).toHaveBeenCalledWith('1');
    expect(itemOnPress).toHaveBeenCalled();
  });

  it('点击遮罩层时应该触发关闭回调', () => {
    const onClose = vi.fn();

    render(
      <SideBar
        visible={true}
        items={[{ key: '1', title: '菜单项1' }]}
        onClose={onClose}
        testID="test-sidebar"
      />
    );

    const overlay = screen.getByTestId('test-sidebar-overlay');
    fireEvent.press(overlay);

    expect(onClose).toHaveBeenCalled();
  });

  it('应该渲染页脚', () => {
    render(
      <SideBar
        visible={true}
        items={[{ key: '1', title: '菜单项1' }]}
        footer={<Text testID="footer-content">页脚内容</Text>}
        testID="test-sidebar"
      />
    );

    expect(screen.getByTestId('footer-content')).toBeTruthy();
  });
});
