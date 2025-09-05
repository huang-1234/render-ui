import { vi } from 'vitest';

// 创建 chalk 模块的模拟
export const mockChalk = {
  blue: vi.fn((text) => `[BLUE]${text}[/BLUE]`),
  green: vi.fn((text) => `[GREEN]${text}[/GREEN]`),
  red: vi.fn((text) => `[RED]${text}[/RED]`),
  yellow: vi.fn((text) => `[YELLOW]${text}[/YELLOW]`),
  white: vi.fn((text) => `[WHITE]${text}[/WHITE]`),
  gray: vi.fn((text) => `[GRAY]${text}[/GRAY]`)
};

// 设置模拟
export function setupChalkMock() {
  vi.mock('chalk', () => {
    return {
      default: mockChalk,
      ...mockChalk
    };
  });
}
