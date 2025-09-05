#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import init from './commands/init.js';
import build from './commands/build.js';
import dev from './commands/dev.js';

const program = new Command();

program
  .name('cross-cli')
  .description('跨端框架命令行工具')
  .version('1.0.0');

program
  .command('init <project-name>')
  .description('初始化新项目')
  .option('-t, --template <template>', '项目模板: basic, component-lib, app', 'basic')
  .action(init);

program
  .command('build')
  .description('构建项目')
  .option('-p, --platform <platform>', '目标平台: h5, rn, weapp, alipay, tt, all', 'all')
  .option('-e, --env <env>', '环境: development, production', 'production')
  .option('--analyze', '分析构建包大小')
  .action(build);

program
  .command('dev')
  .description('开发模式')
  .option('-p, --platform <platform>', '目标平台: h5, rn, weapp, alipay, tt', 'h5')
  .option('--port <port>', '开发服务器端口', '8080')
  .option('--host <host>', '开发服务器主机', 'localhost')
  .action(dev);

program
  .command('create-component <name>')
  .description('创建新组件')
  .option('-t, --type <type>', '组件类型: basic, layout, navigation, form, feedback', 'basic')
  .action((name, options) => {
    console.log(chalk.green(`创建组件: ${name}`));
    console.log(chalk.blue(`类型: ${options.type}`));
  });

program
  .command('doctor')
  .description('检查开发环境')
  .action(() => {
    console.log(chalk.green('检查开发环境...'));
    // TODO: 实现环境检查逻辑
  });

// 错误处理
program.on('command:*', () => {
  console.error(chalk.red(`未知命令: ${program.args.join(' ')}`));
  console.log(chalk.yellow('使用 --help 查看可用命令'));
  process.exit(1);
});

// 解析命令行参数
program.parse();

// 如果没有提供任何参数，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}