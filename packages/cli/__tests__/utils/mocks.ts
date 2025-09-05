import { vi } from 'vitest';

// 创建 fs-extra 模块的模拟
export const mockFsExtra = {
  pathExists: vi.fn(),
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  writeFile: vi.fn(),
  ensureDir: vi.fn(),
  emptyDir: vi.fn(),
  copy: vi.fn()
};

// 创建 child_process 模块的模拟
export const mockChildProcess = {
  execSync: vi.fn(),
  spawn: vi.fn(() => ({
    on: vi.fn(() => ({})),
    kill: vi.fn()
  }))
};

// 创建 inquirer 模块的模拟
export const mockInquirer = {
  prompt: vi.fn()
};

// 创建 ora 模块的模拟
export const mockOra = vi.fn(() => ({
  start: vi.fn(() => ({
    succeed: vi.fn(),
    fail: vi.fn()
  }))
}));

// 设置模拟
export function setupMocks() {
  // 这些模拟设置会在测试文件中单独调用
}

// 重置所有模拟
export function resetMocks() {
  Object.values(mockFsExtra).forEach(mock => {
    if (typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });

  Object.values(mockChildProcess).forEach(mock => {
    if (typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });

  mockInquirer.prompt.mockReset();
  mockOra.mockReset();
}