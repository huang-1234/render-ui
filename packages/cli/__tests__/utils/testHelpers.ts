import { mockProcessExit } from './processExit';

/**
 * 包装一个异步函数，捕获并处理 process.exit 调用
 * @param fn 要执行的异步函数
 * @param expectedExitCode 期望的退出代码（如果不提供，则不检查退出代码）
 * @param setupFn 在执行主函数前运行的设置函数
 * @returns 包装后的函数
 */
export async function expectProcessExit(
  fn: () => Promise<any>,
  expectedExitCode?: number,
  setupFn?: () => void
): Promise<void> {
  try {
    // 先执行设置函数（如果有）
    if (setupFn) {
      setupFn();
    }

    // 执行可能会调用 process.exit 的函数
    await fn();

    // 如果函数没有调用 process.exit，则测试失败
    throw new Error('Expected process.exit to be called, but it was not');
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('process.exit called with code')) {
      if (expectedExitCode !== undefined) {
        const actualExitCode = parseInt(error.message.split('code ')[1]);
        if (actualExitCode !== expectedExitCode) {
          throw new Error(`Expected process.exit to be called with code ${expectedExitCode}, but it was called with code ${actualExitCode}`);
        }
      }
      // 成功捕获 process.exit 调用
      return;
    }
    // 如果是其他错误，则继续抛出
    throw error;
  }
}

/**
 * 包装一个异步函数，捕获特定错误消息
 * @param fn 要执行的异步函数
 * @param errorMessage 期望的错误消息
 * @returns 包装后的函数
 */
export async function expectError(fn: () => Promise<any>, errorMessage: string): Promise<void> {
  try {
    await fn();
    // 如果函数没有抛出错误，则测试失败
    throw new Error(`Expected error with message "${errorMessage}", but no error was thrown`);
  } catch (error) {
    if (error instanceof Error && error.message.includes(errorMessage)) {
      // 成功捕获期望的错误
      return;
    }
    // 如果是其他错误，则继续抛出
    throw error;
  }
}
