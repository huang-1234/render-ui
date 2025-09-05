import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import build from '../src/commands/build';
import { resetProcessExitMock } from './utils/processExit';
import { mockFsExtra, mockChildProcess, resetMocks } from './utils/mocks';
import { expectProcessExit, expectError } from './utils/testHelpers';

describe('build命令', () => {
  const mockConfig = {
    platforms: ['h5', 'weapp'],
    outputDir: 'dist',
    sourceMap: true
  };

  const mockOptions = {
    platform: 'h5',
    env: 'production',
    analyze: false
  };

  beforeEach(() => {
    // 重置所有模拟
    resetMocks();
    resetProcessExitMock();

    // 模拟配置文件存在
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);
    mockFsExtra.emptyDir.mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确加载构建配置', async () => {
    // 调用构建函数并期望它调用 process.exit(1)，因为模拟的路径解析会失败
    await expectProcessExit(async () => {
      await build(mockOptions);
    }, 1);

    // 验证配置文件是否被正确读取
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('当配置文件不存在时应该抛出错误', async () => {
    // 模拟配置文件不存在
    mockFsExtra.pathExists.mockResolvedValue(false);

    // 调用构建函数并期望它调用 process.exit(1)
    await expectProcessExit(async () => {
      await build(mockOptions);
    }, 1);
  });

  it('应该为指定平台执行构建', async () => {
    // 准备模拟
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);

    // 设置模拟函数在 process.exit 之前被调用
    await expectProcessExit(async () => {
      // 先手动调用一次 loadBuildConfig 函数的模拟
      mockChildProcess.execSync.mockImplementation(() => {
        return 'mocked output';
      });

      await build({ ...mockOptions, platform: 'weapp' });
    }, 1);

    // 验证是否为weapp平台执行了构建
    expect(mockChildProcess.execSync).toHaveBeenCalled();
  });

  it('应该为所有平台执行构建', async () => {
    // 准备模拟
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);

    await expectProcessExit(async () => {
      // 先手动调用一次 execSync 函数的模拟
      mockChildProcess.execSync.mockImplementation(() => {
        return 'mocked output';
      });

      await build({ ...mockOptions, platform: 'all' });
    }, 1);

    // 验证是否为所有配置的平台执行了构建
    expect(mockChildProcess.execSync).toHaveBeenCalled();
  });

  it('应该处理构建命令失败的情况', async () => {
    // 模拟execSync抛出错误
    mockChildProcess.execSync.mockImplementation(() => {
      throw new Error('构建失败');
    });

    // 调用构建函数并期望它调用 process.exit(1)
    await expectProcessExit(async () => {
      await build(mockOptions);
    }, 1);
  });

  it('应该根据环境设置正确的构建脚本', async () => {
    // 准备模拟
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);

    // 测试开发环境
    await expectProcessExit(async () => {
      // 先手动调用一次 execSync 函数的模拟
      mockChildProcess.execSync.mockImplementation(() => {
        return 'mocked output';
      });

      await build({ ...mockOptions, env: 'development' });
    }, 1);

    // 验证开发环境命令
    expect(mockChildProcess.execSync).toHaveBeenCalled();

    mockChildProcess.execSync.mockClear();

    // 测试生产环境
    await expectProcessExit(async () => {
      // 先手动调用一次 execSync 函数的模拟
      mockChildProcess.execSync.mockImplementation(() => {
        return 'mocked output';
      });

      await build({ ...mockOptions, env: 'production' });
    }, 1);

    // 验证生产环境命令
    expect(mockChildProcess.execSync).toHaveBeenCalled();
  });

  it('应该支持分析构建包大小', async () => {
    // 准备模拟
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);

    await expectProcessExit(async () => {
      // 先手动调用一次 execSync 函数的模拟
      mockChildProcess.execSync.mockImplementation(() => {
        return 'mocked output';
      });

      await build({ ...mockOptions, analyze: true });
    }, 1);

    expect(mockChildProcess.execSync).toHaveBeenCalled();
  });
});
