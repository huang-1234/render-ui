import { vi } from 'vitest';

// 创建 path 模块的模拟
export const mockPath = {
  resolve: vi.fn((_, p) => `/mock/path/${p}`),
  join: vi.fn((dir, file) => `${dir}/${file}`),
  dirname: vi.fn(() => '/mock/path/dir')
};

// 设置模拟
export function setupPathMock() {
  vi.mock('path', () => {
    return {
      default: mockPath,
      ...mockPath
    };
  });
}
