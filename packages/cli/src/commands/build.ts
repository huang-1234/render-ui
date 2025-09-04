import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

interface BuildOptions {
  platform: string;
  env: string;
  analyze?: boolean;
}

interface BuildConfig {
  platforms: string[];
  outputDir: string;
  sourceMap: boolean;
}

const platformConfigs = {
  h5: {
    name: 'H5 (Web)',
    buildCommand: 'vite build',
    outputDir: 'dist/h5'
  },
  rn: {
    name: 'React Native',
    buildCommand: 'react-native bundle',
    outputDir: 'dist/rn'
  },
  weapp: {
    name: '微信小程序',
    buildCommand: 'taro build --type weapp',
    outputDir: 'dist/weapp'
  },
  alipay: {
    name: '支付宝小程序',
    buildCommand: 'taro build --type alipay',
    outputDir: 'dist/alipay'
  },
  tt: {
    name: '抖音小程序',
    buildCommand: 'taro build --type tt',
    outputDir: 'dist/tt'
  }
};

export default async function build(options: BuildOptions) {
  console.log(chalk.blue('🔨 开始构建项目...'));
  
  try {
    // 读取配置
    const config = await loadBuildConfig();
    
    // 确定构建平台
    const platforms = options.platform === 'all' 
      ? config.platforms 
      : [options.platform];
    
    // 验证平台
    validatePlatforms(platforms);
    
    // 执行构建
    await buildPlatforms(platforms, options);
    
    console.log(chalk.green('✅ 构建完成！'));
    
  } catch (error) {
    console.error(chalk.red('❌ 构建失败:'), error);
    process.exit(1);
  }
}

async function loadBuildConfig(): Promise<BuildConfig> {
  const configPath = path.resolve(process.cwd(), 'cross.config.json');
  
  if (!await fs.pathExists(configPath)) {
    throw new Error('未找到 cross.config.json 配置文件');
  }
  
  return await fs.readJSON(configPath);
}

function validatePlatforms(platforms: string[]) {
  const supportedPlatforms = Object.keys(platformConfigs);
  
  for (const platform of platforms) {
    if (!supportedPlatforms.includes(platform)) {
      throw new Error(`不支持的平台: ${platform}`);
    }
  }
}

async function buildPlatforms(platforms: string[], options: BuildOptions) {
  for (const platform of platforms) {
    await buildSinglePlatform(platform, options);
  }
}

async function buildSinglePlatform(platform: string, options: BuildOptions) {
  const config = platformConfigs[platform as keyof typeof platformConfigs];
  const spinner = ora(`构建 ${config.name}...`).start();
  
  try {
    // 设置环境变量
    process.env.NODE_ENV = options.env;
    process.env.CROSS_PLATFORM = platform;
    
    // 清理输出目录
    await fs.emptyDir(config.outputDir);
    
    // 执行构建命令
    await executeBuildCommand(platform, config, options);
    
    // 后处理
    await postProcessBuild(platform, config);
    
    spinner.succeed(`${config.name} 构建完成`);
    
  } catch (error) {
    spinner.fail(`${config.name} 构建失败`);
    throw error;
  }
}

async function executeBuildCommand(platform: string, config: any, options: BuildOptions) {
  const buildScript = await generateBuildScript(platform, options);
  
  try {
    execSync(buildScript, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } catch (error) {
    throw new Error(`构建命令执行失败: ${buildScript}`);
  }
}

async function generateBuildScript(platform: string, options: BuildOptions): Promise<string> {
  switch (platform) {
    case 'h5':
      return generateH5BuildScript(options);
    case 'rn':
      return generateRNBuildScript(options);
    case 'weapp':
    case 'alipay':
    case 'tt':
      return generateMiniProgramBuildScript(platform, options);
    default:
      throw new Error(`未知平台: ${platform}`);
  }
}

function generateH5BuildScript(options: BuildOptions): string {
  let script = 'vite build';
  
  if (options.analyze) {
    script += ' --analyze';
  }
  
  if (options.env === 'development') {
    script += ' --mode development';
  }
  
  return script;
}

function generateRNBuildScript(options: BuildOptions): string {
  const platform = process.platform === 'darwin' ? 'ios' : 'android';
  let script = `react-native bundle --platform ${platform}`;
  
  script += ' --dev false';
  script += ' --entry-file index.js';
  script += ' --bundle-output dist/rn/main.jsbundle';
  script += ' --assets-dest dist/rn/assets';
  
  if (options.env === 'development') {
    script += ' --dev true';
  }
  
  return script;
}

function generateMiniProgramBuildScript(platform: string, options: BuildOptions): string {
  let script = `taro build --type ${platform}`;
  
  if (options.env === 'development') {
    script += ' --watch';
  }
  
  return script;
}

async function postProcessBuild(platform: string, config: any) {
  switch (platform) {
    case 'weapp':
      await postProcessWeapp(config.outputDir);
      break;
    case 'alipay':
      await postProcessAlipay(config.outputDir);
      break;
    case 'rn':
      await postProcessRN(config.outputDir);
      break;
    case 'h5':
      await postProcessH5(config.outputDir);
      break;
  }
}

async function postProcessWeapp(outputDir: string) {
  // 复制微信小程序配置文件
  const projectConfigPath = path.resolve(process.cwd(), 'project.config.json');
  if (await fs.pathExists(projectConfigPath)) {
    await fs.copy(projectConfigPath, path.join(outputDir, 'project.config.json'));
  }
  
  // 生成默认配置
  const defaultConfig = {
    appid: 'your-app-id',
    projectname: 'cross-platform-app',
    setting: {
      urlCheck: false,
      es6: true,
      enhance: true,
      postcss: true,
      minified: true
    }
  };
  
  await fs.writeJSON(path.join(outputDir, 'project.config.json'), defaultConfig, { spaces: 2 });
}

async function postProcessAlipay(outputDir: string) {
  // 支付宝小程序特定处理
  const miniConfigPath = path.resolve(process.cwd(), 'mini.project.json');
  if (await fs.pathExists(miniConfigPath)) {
    await fs.copy(miniConfigPath, path.join(outputDir, 'mini.project.json'));
  }
}

async function postProcessRN(outputDir: string) {
  // React Native 资源处理
  console.log(chalk.blue('处理 React Native 资源...'));
  
  // 复制图片资源
  const assetsDir = path.resolve(process.cwd(), 'src/assets');
  if (await fs.pathExists(assetsDir)) {
    await fs.copy(assetsDir, path.join(outputDir, 'assets'));
  }
}

async function postProcessH5(outputDir: string) {
  // H5 特定处理
  console.log(chalk.blue('优化 H5 构建产物...'));
  
  // 生成 PWA manifest
  const manifest = {
    name: 'Cross Platform App',
    short_name: 'CrossApp',
    start_url: '/',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff'
  };
  
  await fs.writeJSON(path.join(outputDir, 'manifest.json'), manifest, { spaces: 2 });
}