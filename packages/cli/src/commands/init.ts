import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

interface InitOptions {
  template: string;
}

interface ProjectConfig {
  name: string;
  template: string;
  platforms: string[];
  features: string[];
}

const templates = {
  basic: {
    name: '基础项目',
    description: '包含基本的跨端配置和示例页面',
    platforms: ['h5', 'weapp']
  },
  'component-lib': {
    name: '组件库',
    description: '用于开发跨端组件库的模板',
    platforms: ['h5', 'rn', 'weapp', 'alipay']
  },
  app: {
    name: '应用项目',
    description: '完整的跨端应用模板，包含路由、状态管理等',
    platforms: ['h5', 'rn', 'weapp', 'alipay', 'tt']
  }
};

export default async function init(projectName: string, options: InitOptions) {
  console.log(chalk.blue(`🚀 创建跨端项目: ${projectName}`));
  
  const projectPath = path.resolve(process.cwd(), projectName);
  
  // 检查目录是否已存在
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`❌ 目录 ${projectName} 已存在`));
    process.exit(1);
  }

  try {
    // 收集项目配置
    const config = await collectProjectConfig(projectName, options);
    
    // 创建项目
    await createProject(projectPath, config);
    
    console.log(chalk.green(`✅ 项目 ${projectName} 创建成功！`));
    console.log(chalk.yellow('\n下一步:'));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white('  pnpm install'));
    console.log(chalk.white('  pnpm dev'));
    
  } catch (error) {
    console.error(chalk.red('❌ 项目创建失败:'), error);
    process.exit(1);
  }
}

async function collectProjectConfig(projectName: string, options: InitOptions): Promise<ProjectConfig> {
  const template = templates[options.template as keyof typeof templates];
  
  if (!template) {
    console.error(chalk.red(`❌ 未知模板: ${options.template}`));
    process.exit(1);
  }

  console.log(chalk.blue(`📋 模板: ${template.name}`));
  console.log(chalk.gray(`   ${template.description}`));

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: '选择目标平台:',
      choices: [
        { name: 'H5 (Web)', value: 'h5', checked: true },
        { name: 'React Native', value: 'rn' },
        { name: '微信小程序', value: 'weapp', checked: true },
        { name: '支付宝小程序', value: 'alipay' },
        { name: '抖音小程序', value: 'tt' }
      ],
      default: template.platforms
    },
    {
      type: 'checkbox',
      name: 'features',
      message: '选择功能特性:',
      choices: [
        { name: 'TypeScript', value: 'typescript', checked: true },
        { name: '路由管理', value: 'router', checked: true },
        { name: '状态管理', value: 'state-management' },
        { name: 'UI 组件库', value: 'ui-components', checked: true },
        { name: '国际化', value: 'i18n' },
        { name: '主题定制', value: 'theming' }
      ]
    }
  ]);

  return {
    name: projectName,
    template: options.template,
    platforms: answers.platforms,
    features: answers.features
  };
}

async function createProject(projectPath: string, config: ProjectConfig) {
  const spinner = ora('创建项目文件...').start();
  
  try {
    // 创建项目目录
    await fs.ensureDir(projectPath);
    
    // 创建基础文件结构
    await createProjectStructure(projectPath, config);
    
    // 生成配置文件
    await generateConfigFiles(projectPath, config);
    
    // 生成示例代码
    await generateExampleCode(projectPath, config);
    
    spinner.succeed('项目文件创建完成');
    
  } catch (error) {
    spinner.fail('项目文件创建失败');
    throw error;
  }
}

async function createProjectStructure(projectPath: string, config: ProjectConfig) {
  const dirs = [
    'src',
    'src/components',
    'src/pages',
    'src/utils',
    'src/styles',
    'config',
    'scripts'
  ];

  // 根据平台创建对应目录
  config.platforms.forEach(platform => {
    dirs.push(`dist/${platform}`);
  });

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
}

async function generateConfigFiles(projectPath: string, config: ProjectConfig) {
  // package.json
  const packageJson = {
    name: config.name,
    version: '1.0.0',
    description: '',
    scripts: {
      dev: 'cross-cli dev',
      build: 'cross-cli build',
      'build:h5': 'cross-cli build -p h5',
      'build:weapp': 'cross-cli build -p weapp',
      test: 'vitest'
    },
    dependencies: {
      '@cross-platform/core': '^1.0.0',
      '@cross-platform/components': '^1.0.0',
      react: '^18.0.0'
    },
    devDependencies: {
      '@cross-platform/cli': '^1.0.0',
      typescript: '^5.0.0',
      vitest: '^1.0.0'
    }
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  // tsconfig.json
  if (config.features.includes('typescript')) {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        lib: ['DOM', 'DOM.Iterable', 'ES6'],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
  }

  // 跨端配置文件
  const crossConfig = {
    platforms: config.platforms,
    features: config.features,
    build: {
      outputDir: 'dist',
      sourceMap: true
    },
    dev: {
      port: 8080,
      host: 'localhost'
    }
  };

  await fs.writeJSON(path.join(projectPath, 'cross.config.json'), crossConfig, { spaces: 2 });
}

async function generateExampleCode(projectPath: string, config: ProjectConfig) {
  // 生成入口文件
  const appContent = `import React from 'react';
import { Runtime } from '@cross-platform/core';
import HomePage from './pages/Home';

function App() {
  return (
    <Runtime>
      <HomePage />
    </Runtime>
  );
}

export default App;`;

  const ext = config.features.includes('typescript') ? 'tsx' : 'jsx';
  await fs.writeFile(path.join(projectPath, `src/App.${ext}`), appContent);

  // 生成示例页面
  const homePageContent = `import React from 'react';
import { View, Text, Button } from '@cross-platform/components';

const HomePage: React.FC = () => {
  const handleClick = () => {
    console.log('Hello Cross Platform!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        欢迎使用跨端框架
      </Text>
      <Button onClick={handleClick}>
        点击测试
      </Button>
    </View>
  );
};

export default HomePage;`;

  await fs.ensureDir(path.join(projectPath, 'src/pages'));
  await fs.writeFile(path.join(projectPath, `src/pages/Home.${ext}`), homePageContent);
}