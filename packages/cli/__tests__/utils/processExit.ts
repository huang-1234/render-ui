import { vi } from 'vitest';

// 保存原始的 process.exit
const originalProcessExit = process.exit;

// 创建一个模拟的 process.exit 函数
export const mockProcessExit = vi.fn((code?: number) => {
  throw new Error(`process.exit called with code ${code}`);
});

// 安装模拟
export function setupProcessExitMock() {
  process.exit = mockProcessExit as any;
}

// 恢复原始的 process.exit
export function restoreProcessExit() {
  process.exit = originalProcessExit;
}

// 重置模拟状态
export function resetProcessExitMock() {
  mockProcessExit.mockClear();
}
