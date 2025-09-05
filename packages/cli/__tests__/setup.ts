// 全局测试设置文件
import { vi, beforeAll, afterAll } from 'vitest';
import { setupProcessExitMock, restoreProcessExit } from './utils/processExit';
import { setupChalkMock } from './utils/mockChalk';
import { setupPathMock } from './utils/mockPath';
import { mockFsExtra } from './utils/mocks';

// 设置模拟
vi.mock('fs-extra', () => {
  return {
    default: mockFsExtra,
    ...mockFsExtra
  };
});
setupChalkMock();
setupPathMock();

// 模拟控制台输出，避免测试时输出过多信息
beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});

  // 安装 process.exit 模拟
  setupProcessExitMock();
});

// 恢复控制台输出和 process.exit
afterAll(() => {
  vi.restoreAllMocks();
  restoreProcessExit();
});
