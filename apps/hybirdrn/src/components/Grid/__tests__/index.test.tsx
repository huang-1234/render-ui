import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from 'vitest';
import { Text, View } from 'react-native';
import Grid from '../index';

describe('Grid 组件', () => {
  it('应该正确渲染子元素', () => {
    render(
      <Grid testID="test-grid">
        <Text>项目1</Text>
        <Text>项目2</Text>
        <Text>项目3</Text>
        <Text>项目4</Text>
      </Grid>
    );

    const gridElement = screen.getByTestId('test-grid');
    expect(gridElement).toBeTruthy();
    expect(gridElement.props.children.length).toBe(4);
  });

  it('应该根据 columns 属性设置列数', () => {
    render(
      <Grid columns={2} testID="test-grid">
        <Text>项目1</Text>
        <Text>项目2</Text>
      </Grid>
    );

    const gridElement = screen.getByTestId('test-grid');
    const firstChild = gridElement.props.children[0];
    expect(firstChild.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '50%' })])
    );
  });

  it('应该根据 gap 属性设置间距', () => {
    render(
      <Grid gap={16} testID="test-grid">
        <Text>项目1</Text>
        <Text>项目2</Text>
      </Grid>
    );

    const gridElement = screen.getByTestId('test-grid');
    expect(gridElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ marginHorizontal: -8 })])
    );

    const firstChild = gridElement.props.children[0];
    expect(firstChild.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ padding: 8 })])
    );
  });
});
