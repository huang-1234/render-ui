# CLI 命令测试说明

本目录包含了对 CLI 命令的单元测试，使用 Vitest 作为测试框架。

## 测试结构

测试文件按照命令模块进行组织：

- `build.test.ts`：测试构建命令
- `dev.test.ts`：测试开发服务器命令
- `init.test.ts`：测试项目初始化命令
- `setup.ts`：全局测试设置
- `utils/`：测试工具函数

## 测试工具

- `utils/mocks.ts`：提供模拟对象和函数
- `utils/processExit.ts`：处理 `process.exit` 调用
- `utils/testHelpers.ts`：提供测试辅助函数

## 运行测试

可以使用以下命令运行测试：

```bash
# 运行所有测试
pnpm test

# 以监听模式运行测试
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

## 测试策略

1. **模拟外部依赖**：使用 Vitest 的 `vi.mock()` 模拟外部依赖，如文件系统、子进程等。
2. **处理 process.exit**：使用 `expectProcessExit` 函数捕获并处理 `process.exit` 调用。
3. **验证函数调用**：使用 `expect().toHaveBeenCalled()` 验证模拟函数是否被调用。

## 注意事项

1. 测试中需要处理 `process.exit` 调用，否则会中断测试。
2. 模拟函数需要在 `process.exit` 调用之前被调用，否则测试会失败。
3. 使用 `vi.mock()` 时需要提供默认导出，否则会导致错误。

## 已知问题

1. 一些测试可能会超时，可以通过增加超时时间解决。
2. 一些测试可能会失败，因为模拟函数没有被调用。这是因为 `process.exit` 在模拟函数被调用之前就终止了函数执行。
