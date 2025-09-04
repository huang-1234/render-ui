const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// 构建所有包的脚本
async function buildAll() {
  console.log(chalk.blue('🚀 开始构建所有包...'));
  
  const packages = [
    'packages/core',
    'packages/cli', 
    'packages/components',
    'packages/example'
  ];
  
  for (const pkg of packages) {
    await buildPackage(pkg);
  }
  
  console.log(chalk.green('✅ 所有包构建完成！'));
}

async function buildPackage(packagePath) {
  const packageName = path.basename(packagePath);
  console.log(chalk.yellow(`📦 构建 ${packageName}...`));
  
  try {
    // 检查 package.json 是否存在
    const packageJsonPath = path.join(packagePath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.gray(`⏭️  跳过 ${packageName} (无 package.json)`));
      return;
    }
    
    // 读取 package.json
    const packageJson = await fs.readJSON(packageJsonPath);
    
    // 检查是否有构建脚本
    if (!packageJson.scripts || !packageJson.scripts.build) {
      console.log(chalk.gray(`⏭️  跳过 ${packageName} (无构建脚本)`));
      return;
    }
    
    // 执行构建
    execSync('npm run build', {
      cwd: packagePath,
      stdio: 'inherit'
    });
    
    console.log(chalk.green(`✅ ${packageName} 构建成功`));
    
  } catch (error) {
    console.error(chalk.red(`❌ ${packageName} 构建失败:`), error.message);
    process.exit(1);
  }
}

// 清理所有构建产物
async function cleanAll() {
  console.log(chalk.blue('🧹 清理构建产物...'));
  
  const cleanPaths = [
    'packages/*/dist',
    'packages/*/node_modules',
    'node_modules',
    '*.tgz'
  ];
  
  for (const pattern of cleanPaths) {
    try {
      const glob = require('glob');
      const paths = glob.sync(pattern);
      
      for (const p of paths) {
        await fs.remove(p);
        console.log(chalk.gray(`🗑️  删除 ${p}`));
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  清理 ${pattern} 失败:`, error.message));
    }
  }
  
  console.log(chalk.green('✅ 清理完成'));
}

// 安装所有依赖
async function installAll() {
  console.log(chalk.blue('📥 安装依赖...'));
  
  try {
    // 使用 pnpm 安装
    execSync('pnpm install', { stdio: 'inherit' });
    console.log(chalk.green('✅ 依赖安装完成'));
  } catch (error) {
    console.error(chalk.red('❌ 依赖安装失败:'), error.message);
    process.exit(1);
  }
}

// 发布所有包
async function publishAll() {
  console.log(chalk.blue('📤 发布所有包...'));
  
  const packages = [
    'packages/core',
    'packages/cli',
    'packages/components'
  ];
  
  for (const pkg of packages) {
    await publishPackage(pkg);
  }
  
  console.log(chalk.green('✅ 所有包发布完成！'));
}

async function publishPackage(packagePath) {
  const packageName = path.basename(packagePath);
  console.log(chalk.yellow(`📤 发布 ${packageName}...`));
  
  try {
    // 检查是否已构建
    const distPath = path.join(packagePath, 'dist');
    if (!await fs.pathExists(distPath)) {
      console.log(chalk.yellow(`⚠️  ${packageName} 未构建，先执行构建...`));
      await buildPackage(packagePath);
    }
    
    // 发布到 npm
    execSync('npm publish --access public', {
      cwd: packagePath,
      stdio: 'inherit'
    });
    
    console.log(chalk.green(`✅ ${packageName} 发布成功`));
    
  } catch (error) {
    console.error(chalk.red(`❌ ${packageName} 发布失败:`), error.message);
  }
}

// 命令行参数处理
const command = process.argv[2];

switch (command) {
  case 'build':
    buildAll();
    break;
  case 'clean':
    cleanAll();
    break;
  case 'install':
    installAll();
    break;
  case 'publish':
    publishAll();
    break;
  case 'dev':
    console.log(chalk.blue('🚀 启动开发模式...'));
    execSync('pnpm --filter @cross-platform/example dev', { stdio: 'inherit' });
    break;
  default:
    console.log(chalk.blue('跨端框架构建脚本'));
    console.log('');
    console.log('用法:');
    console.log('  node scripts/build-all.js <command>');
    console.log('');
    console.log('命令:');
    console.log('  build     构建所有包');
    console.log('  clean     清理构建产物');
    console.log('  install   安装依赖');
    console.log('  publish   发布所有包');
    console.log('  dev       启动开发模式');
    break;
}