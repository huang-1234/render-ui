import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';

interface DevOptions {
  platform: string;
  port: string;
  host: string;
}

interface DevConfig {
  port: number;
  host: string;
  platforms: string[];
}

const devConfigs = {
  h5: {
    name: 'H5 (Web)',
    command: 'vite',
    args: ['--host', '0.0.0.0'],
    port: 8080
  },
  rn: {
    name: 'React Native',
    command: 'react-native',
    args: ['start'],
    port: 8081
  },
  weapp: {
    name: '微信小程序',
    command: 'taro',
    args: ['build', '--type', 'weapp', '--watch'],
    port: 8082
  },
  alipay: {
    name: '支付宝小程序',
    command: 'taro',
    args: ['build', '--type', 'alipay', '--watch'],
    port: 8083
  },
  tt: {
    name: '抖音小程序',
    command: 'taro',
    args: ['build', '--type', 'tt', '--watch'],
    port: 8084
  }
};

export default async function dev(options: DevOptions) {
  console.log(chalk.blue(`🚀 启动开发服务器 (${options.platform})...`));
  
  try {
    // 读取配置
    const config = await loadDevConfig();
    
    // 验证平台
    validatePlatform(options.platform);
    
    // 启动开发服务器
    await startDevServer(options.platform, options, config);
    
  } catch (error) {
    console.error(chalk.red('❌ 启动失败:'), error);
    process.exit(1);
  }
}

async function loadDevConfig(): Promise<DevConfig> {
  const configPath = path.resolve(process.cwd(), 'cross.config.json');
  
  if (!await fs.pathExists(configPath)) {
    console.warn(chalk.yellow('⚠️  未找到 cross.config.json，使用默认配置'));
    return {
      port: 8080,
      host: 'localhost',
      platforms: ['h5']
    };
  }
  
  const config = await fs.readJSON(configPath);
  return config.dev || {
    port: 8080,
    host: 'localhost',
    platforms: config.platforms || ['h5']
  };
}

function validatePlatform(platform: string) {
  const supportedPlatforms = Object.keys(devConfigs);
  
  if (!supportedPlatforms.includes(platform)) {
    throw new Error(`不支持的平台: ${platform}。支持的平台: ${supportedPlatforms.join(', ')}`);
  }
}

async function startDevServer(platform: string, options: DevOptions, config: DevConfig) {
  const platformConfig = devConfigs[platform as keyof typeof devConfigs];
  const spinner = ora(`启动 ${platformConfig.name} 开发服务器...`).start();
  
  try {
    // 设置环境变量
    process.env.NODE_ENV = 'development';
    process.env.CROSS_PLATFORM = platform;
    
    // 准备开发环境
    await prepareDevEnvironment(platform);
    
    // 启动服务器
    await launchDevServer(platform, options, platformConfig);
    
    spinner.succeed(`${platformConfig.name} 开发服务器启动成功`);
    
    // 显示访问信息
    displayAccessInfo(platform, options);
    
    // 监听文件变化
    await watchFileChanges(platform);
    
  } catch (error) {
    spinner.fail(`${platformConfig.name} 启动失败`);
    throw error;
  }
}

async function prepareDevEnvironment(platform: string) {
  switch (platform) {
    case 'h5':
      await prepareH5Environment();
      break;
    case 'rn':
      await prepareRNEnvironment();
      break;
    case 'weapp':
    case 'alipay':
    case 'tt':
      await prepareMiniProgramEnvironment(platform);
      break;
  }
}

async function prepareH5Environment() {
  // 确保 H5 开发环境配置
  const viteConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
  
  if (!await fs.pathExists(viteConfigPath)) {
    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: '0.0.0.0',
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});`;
    
    await fs.writeFile(viteConfigPath, viteConfig);
  }
}

async function prepareRNEnvironment() {
  // 检查 React Native 环境
  console.log(chalk.blue('检查 React Native 环境...'));
  
  // 检查 metro.config.js
  const metroConfigPath = path.resolve(process.cwd(), 'metro.config.js');
  
  if (!await fs.pathExists(metroConfigPath)) {
    const metroConfig = `const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();`;
    
    await fs.writeFile(metroConfigPath, metroConfig);
  }
}

async function prepareMiniProgramEnvironment(platform: string) {
  // 准备小程序开发环境
  console.log(chalk.blue(`准备 ${platform} 小程序开发环境...`));
  
  // 检查 Taro 配置
  const taroConfigPath = path.resolve(process.cwd(), 'config/index.js');
  
  if (!await fs.pathExists(taroConfigPath)) {
    await fs.ensureDir(path.dirname(taroConfigPath));
    
    const taroConfig = `const config = {
  projectName: 'cross-platform-app',
  date: '${new Date().toISOString().split('T')[0]}',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist/${platform}',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};`;
    
    await fs.writeFile(taroConfigPath, taroConfig);
  }
}

async function launchDevServer(platform: string, options: DevOptions, platformConfig: any) {
  return new Promise<void>((resolve, reject) => {
    const args = [...platformConfig.args];
    
    // 添加端口参数
    if (platform === 'h5') {
      args.push('--port', options.port);
      args.push('--host', options.host);
    }
    
    const child = spawn(platformConfig.command, args, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    child.on('error', (error) => {
      reject(new Error(`启动命令失败: ${error.message}`));
    });
    
    // 等待服务器启动
    setTimeout(() => {
      resolve();
    }, 3000);
    
    // 处理进程退出
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n正在关闭开发服务器...'));
      child.kill('SIGINT');
      process.exit(0);
    });
  });
}

function displayAccessInfo(platform: string, options: DevOptions) {
  console.log(chalk.green('\n✅ 开发服务器启动成功！'));
  console.log(chalk.blue('访问信息:'));
  
  switch (platform) {
    case 'h5':
      console.log(chalk.white(`  本地访问: http://localhost:${options.port}`));
      console.log(chalk.white(`  网络访问: http://${getLocalIP()}:${options.port}`));
      break;
    case 'rn':
      console.log(chalk.white('  使用 React Native CLI 或 Expo 客户端扫码访问'));
      break;
    case 'weapp':
      console.log(chalk.white('  使用微信开发者工具打开 dist/weapp 目录'));
      break;
    case 'alipay':
      console.log(chalk.white('  使用支付宝小程序开发工具打开 dist/alipay 目录'));
      break;
    case 'tt':
      console.log(chalk.white('  使用抖音小程序开发工具打开 dist/tt 目录'));
      break;
  }
  
  console.log(chalk.gray('\n按 Ctrl+C 停止服务器'));
}

function getLocalIP(): string {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return 'localhost';
}

async function watchFileChanges(platform: string) {
  // 实现文件监听和热重载
  console.log(chalk.blue('监听文件变化...'));
  
  // 这里可以添加更复杂的文件监听逻辑
  // 比如使用 chokidar 监听源码变化，触发重新编译
}