import { useMemo, useRef } from 'react';

/**
 * 瀑布流项目接口
 */
export interface WaterfallItem {
  id: string;
  height: number;
}

/**
 * 瀑布流布局信息接口
 */
export interface WaterfallLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
}

/**
 * 瀑布流布局计算器
 * 用于计算两栏瀑布流布局
 */
export class WaterfallLayoutCalculator {
  private columnHeights: number[];
  private columnWidth: number;
  private columnGap: number;

  /**
   * 创建瀑布流布局计算器
   * @param numColumns 列数
   * @param containerWidth 容器宽度
   * @param columnGap 列间距
   */
  constructor(numColumns: number, containerWidth: number, columnGap: number = 8) {
    this.columnGap = columnGap;
    this.columnWidth = (containerWidth - (numColumns - 1) * columnGap) / numColumns;
    this.columnHeights = new Array(numColumns).fill(0);
  }

  /**
   * 添加项目到瀑布流布局
   * @param itemHeight 项目高度
   * @returns 项目布局信息
   */
  addItem(itemHeight: number): WaterfallLayout {
    // 找到最短的列
    const shortestColumn = this.columnHeights.indexOf(Math.min(...this.columnHeights));

    const x = shortestColumn * (this.columnWidth + this.columnGap);
    const y = this.columnHeights[shortestColumn];

    // 更新列高度
    this.columnHeights[shortestColumn] += itemHeight + this.columnGap;

    return {
      x,
      y,
      width: this.columnWidth,
      height: itemHeight,
      column: shortestColumn
    };
  }

  /**
   * 获取当前瀑布流的总高度
   * @returns 总高度
   */
  getTotalHeight(): number {
    return Math.max(...this.columnHeights);
  }

  /**
   * 重置布局计算器
   */
  reset(): void {
    this.columnHeights.fill(0);
  }
}

/**
 * 预计算瀑布流布局的Hook
 * @param data 数据源
 * @param numColumns 列数
 * @param containerWidth 容器宽度
 * @param getItemHeight 获取项目高度的函数
 * @returns 项目布局信息Map
 */
export const useWaterfallLayout = <T extends { id?: string }>(
  data: T[],
  numColumns: number,
  containerWidth: number,
  getItemHeight: (item: T, index: number) => number
): Map<string, WaterfallLayout> => {
  const layouts = useRef<Map<string, WaterfallLayout>>(new Map()).current;

  useMemo(() => {
    const calculator = new WaterfallLayoutCalculator(numColumns, containerWidth);
    layouts.clear();

    data.forEach((item, index) => {
      const height = getItemHeight(item, index);
      const layout = calculator.addItem(height);
      const key = item.id || index.toString();
      layouts.set(key, layout);
    });
  }, [data, numColumns, containerWidth, getItemHeight]);

  return layouts;
};
