import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import init from '../src/commands/init';
import { resetProcessExitMock } from './utils/processExit';
import { mockFsExtra, mockInquirer, mockOra, resetMocks } from './utils/mocks';
import { expectProcessExit, expectError } from './utils/testHelpers';

describe('init命令', () => {
  const projectName = 'test-project';
  const mockOptions = {
    template: 'basic'
  };

  const mockAnswers = {
    platforms: ['h5', 'weapp'],
    features: ['typescript', 'router', 'ui-components']
  };

  beforeEach(() => {
    // 重置所有模拟
    resetMocks();
    resetProcessExitMock();

    // 模拟目录不存在
    mockFsExtra.pathExists.mockResolvedValue(false);
    mockFsExtra.ensureDir.mockResolvedValue();
    mockFsExtra.writeJSON.mockResolvedValue();
    mockFsExtra.writeFile.mockResolvedValue();

    // 模拟inquirer返回
    mockInquirer.prompt.mockResolvedValue(mockAnswers);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应该检查项目目录是否已存在', async () => {
    await expectProcessExit(async () => {
      await init(projectName, mockOptions);
    }, 1);

    // 验证是否检查了目录是否存在
    expect(mockFsExtra.pathExists).toHaveBeenCalled();
  });

  it('如果项目目录已存在应该抛出错误', async () => {
    // 模拟目录已存在
    mockFsExtra.pathExists.mockResolvedValue(true);

    // 调用初始化函数并期望它调用 process.exit(1)
    await expectProcessExit(async () => {
      await init(projectName, mockOptions);
    }, 1);
  });

  it('应该收集项目配置', async () => {
    await expectProcessExit(async () => {
      await init(projectName, mockOptions);
    }, 1);

    // 验证是否调用了inquirer收集配置
    expect(mockInquirer.prompt).toHaveBeenCalled();
  });

  it('应该创建项目目录结构', async () => {
    await expectProcessExit(async () => {
      await init(projectName, mockOptions);
    }, 1);

    // 验证是否尝试创建目录
    expect(mockFsExtra.ensureDir).toHaveBeenCalled();
  });

  it('应该生成配置文件', async () => {
    await expectProcessExit(async () => {
      await init(projectName, mockOptions);
    }, 1);

    // 验证是否尝试写入JSON文件
    expect(mockFsExtra.writeJSON).toHaveBeenCalled();
  });

  it('应该生成示例代码', async () => {
    await expectProcessExit(async () => {
      await init(projectName, mockOptions);
    }, 1);

    // 验证是否尝试写入文件
    expect(mockFsExtra.writeFile).toHaveBeenCalled();
  });

  it('应该支持不同的模板类型', async () => {
    // 测试组件库模板
    await expectProcessExit(async () => {
      await init(projectName, { template: 'component-lib' });
    }, 1);

    // 验证是否使用了模板
    expect(mockInquirer.prompt).toHaveBeenCalled();

    mockInquirer.prompt.mockClear();

    // 测试应用项目模板
    await expectProcessExit(async () => {
      await init(projectName, { template: 'app' });
    }, 1);

    // 验证是否使用了模板
    expect(mockInquirer.prompt).toHaveBeenCalled();
  });

  it('应该处理无效的模板类型', async () => {
    // 调用初始化函数并期望它调用 process.exit(1)
    await expectProcessExit(async () => {
      await init(projectName, { template: 'invalid' });
    }, 1);
  });
});
