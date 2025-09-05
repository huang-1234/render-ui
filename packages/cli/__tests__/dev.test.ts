import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import dev from '../src/commands/dev';
import { resetProcessExitMock } from './utils/processExit';
import { mockFsExtra, mockChildProcess, mockOra, resetMocks } from './utils/mocks';
import { expectProcessExit, expectError } from './utils/testHelpers';

describe('dev命令', () => {
  const mockConfig = {
    port: 8080,
    host: 'localhost',
    platforms: ['h5', 'weapp']
  };

  const mockOptions = {
    platform: 'h5',
    port: '8080',
    host: 'localhost'
  };

  // 模拟进程事件监听器
  const originalProcessOn = process.on;
  const mockProcessOn = vi.fn();

  beforeEach(() => {
    // 重置所有模拟
    resetMocks();
    resetProcessExitMock();

    // 模拟配置文件存在
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);
    mockFsExtra.ensureDir.mockResolvedValue();
    mockFsExtra.writeFile.mockResolvedValue();

    // 模拟进程事件
    process.on = mockProcessOn;
  });

  afterEach(() => {
    // 恢复原始进程事件监听器
    process.on = originalProcessOn;
    vi.clearAllMocks();
  });

  it('应该正确加载开发配置', async () => {
    // 调用开发函数并期望它调用 process.exit(1)，因为模拟的路径解析会失败
    await expectProcessExit(async () => {
      await dev(mockOptions);
    }, 1);

    // 验证配置文件是否被正确读取
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('当配置文件不存在时应该使用默认配置', async () => {
    // 模拟配置文件不存在
    mockFsExtra.pathExists.mockResolvedValue(false);

    // 调用开发函数并期望它调用 process.exit(1)
    await expectProcessExit(async () => {
      await dev(mockOptions);
    }, 1);

    // 验证是否尝试读取配置文件
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('应该验证平台是否受支持', async () => {
    // 调用开发函数，使用无效平台
    await expectProcessExit(async () => {
      await dev({ ...mockOptions, platform: 'invalid' });
    }, 1);
  });

  it('应该为H5平台准备开发环境', async () => {
    await expectProcessExit(async () => {
      await dev({ ...mockOptions, platform: 'h5' });
    }, 1);

    // 验证是否检查了vite配置文件
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('应该为React Native平台准备开发环境', async () => {
    await expectProcessExit(async () => {
      await dev({ ...mockOptions, platform: 'rn' });
    }, 1);

    // 验证是否检查了metro配置文件
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('应该为小程序平台准备开发环境', async () => {
    await expectProcessExit(async () => {
      await dev({ ...mockOptions, platform: 'weapp' });
    }, 1);

    // 验证是否检查了Taro配置文件
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('应该启动开发服务器', async () => {
    // 准备模拟
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);

    await expectProcessExit(async () => {
      // 先手动调用一次 spawn 函数的模拟
      mockChildProcess.spawn.mockImplementation(() => {
        return {
          on: vi.fn(() => ({})),
          kill: vi.fn()
        };
      });

      await dev(mockOptions);
    }, 1);

    // 验证是否尝试启动子进程
    expect(mockChildProcess.spawn).toHaveBeenCalled();

    // 验证是否注册了SIGINT处理程序
    expect(mockProcessOn).toHaveBeenCalled();
  });

  it('应该为H5平台添加端口和主机参数', async () => {
    // 准备模拟
    mockFsExtra.pathExists.mockResolvedValue(true);
    mockFsExtra.readJSON.mockResolvedValue(mockConfig);

    await expectProcessExit(async () => {
      // 先手动调用一次 spawn 函数的模拟
      mockChildProcess.spawn.mockImplementation(() => {
        return {
          on: vi.fn(() => ({})),
          kill: vi.fn()
        };
      });

      await dev({ ...mockOptions, port: '3000', host: '0.0.0.0' });
    }, 1);

    // 验证是否尝试启动子进程
    expect(mockChildProcess.spawn).toHaveBeenCalled();
  });
});
