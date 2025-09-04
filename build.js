#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 定义包的构建顺序
const packages = [
  'core',
  'components',
  'h5-renderer',
  'mini-program-renderer',
  'react-native-renderer',
  'cli',
  'example'
];

// 是否为生产环境构建
const isProd = process.argv.includes('--prod');
const buildScript = isProd ? 'build:prod' : 'build';

// 是否只构建特定的包
const targetPackage = process.argv.find(arg => arg.startsWith('--package='))?.split('=')[1];

console.log(`🚀 开始${isProd ? '生产环境' : '开发环境'}构建...`);

try {
  // 如果指定了特定包，只构建该包
  if (targetPackage) {
    if (packages.includes(targetPackage)) {
      buildPackage(targetPackage);
    } else {
      console.error(`❌ 未找到包: ${targetPackage}`);
      process.exit(1);
    }
  } else {
    // 按顺序构建所有包
    for (const pkg of packages) {
      buildPackage(pkg);
    }
  }

  console.log('✅ 构建完成!');
} catch (error) {
  console.error('❌ 构建失败:', error);
  process.exit(1);
}

function buildPackage(packageName) {
  const packagePath = path.join(__dirname, 'packages', packageName);

  // 检查包是否存在
  if (!fs.existsSync(packagePath)) {
    console.log(`⚠️ 跳过不存在的包: ${packageName}`);
    return;
  }

  // 检查package.json是否存在
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⚠️ 跳过没有package.json的包: ${packageName}`);
    return;
  }

  // 读取package.json检查是否有构建脚本
  const packageJson = require(packageJsonPath);
  if (!packageJson.scripts || !packageJson.scripts[buildScript]) {
    console.log(`⚠️ 跳过没有${buildScript}脚本的包: ${packageName}`);
    return;
  }

  console.log(`🔨 构建 ${packageName}...`);

  try {
    execSync(`cd packages/${packageName} && pnpm ${buildScript}`, {
      stdio: 'inherit'
    });
    console.log(`✅ ${packageName} 构建成功`);
  } catch (error) {
    console.error(`❌ ${packageName} 构建失败:`, error);
    throw error;
  }
}
