# 跨端框架 (Cross Platform Framework)

一个基于 React、React Native、TypeScript 的一码多投跨端组件库和相关生态API。

## ✨ 特性

- 🚀 **真正跨端**: 一套代码运行于 Native (iOS/Android)、H5、各大平台小程序
- 💻 **开发体验统一**: 采用 React 语法，支持 Hooks、TypeScript
- ⚡ **性能接近原生**: 通过优化手段确保各端流畅体验
- 🎨 **生态丰富**: 提供完善的组件库、工具链和最佳实践
- 🔧 **工具链完善**: CLI 工具、构建系统、调试工具一应俱全
- 📱 **响应式设计**: 支持多种屏幕尺寸和设备类型

## 🏗️ 架构设计

```
cross-platform-framework/
├── packages/
│   ├── cli/                         # 脚手架工具
│   ├── core/                        # 核心运行时库
│   ├── components/                  # 基础组件库
│   ├── example/                     # 示例项目
│   └── docs/                        # 文档
├── scripts/                         # 构建脚本
└── README.md
```

## 🚀 快速开始

### 安装

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build
```

### 创建新项目

```bash
# 使用 CLI 创建项目
npx @cross-platform/cli init my-app

# 进入项目目录
cd my-app

# 安装依赖
pnpm install
```

### 开发

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发  
pnpm dev:weapp

# React Native 开发
pnpm dev:rn
```

### 构建

```bash
# 构建所有平台
pnpm build

# 构建特定平台
pnpm build:h5
pnpm build:weapp
pnpm build:rn
```

## 📖 使用示例

### 基础用法

```tsx
import React from 'react';
import { 
  RuntimeProvider, 
  View, 
  Text, 
  Button, 
  SafeArea 
} from '@cross-platform/components';

function App() {
  return (
    <RuntimeProvider>
      <SafeArea top bottom>
        <View style={{ padding: 20 }}>
          <Text fontSize={18} fontWeight="bold">
            Hello Cross Platform!
          </Text>
          <Button 
            type="primary" 
            onPress={() => console.log('Button pressed')}
          >
            点击我
          </Button>
        </View>
      </SafeArea>
    </RuntimeProvider>
  );
}

export default App;
```

### 使用 Hooks

```tsx
import React from 'react';
import { 
  usePlatform, 
  useSystemInfo, 
  useNavigation,
  useUI 
} from '@cross-platform/components';

function MyComponent() {
  const platform = usePlatform();
  const systemInfo = useSystemInfo();
  const navigation = useNavigation();
  const ui = useUI();

  const handlePress = async () => {
    await ui.showToast({ title: '操作成功', icon: 'success' });
    await navigation.navigateTo('/pages/detail');
  };

  return (
    <View>
      <Text>当前平台: {platform}</Text>
      <Text>屏幕尺寸: {systemInfo?.screenWidth} x {systemInfo?.screenHeight}</Text>
      <Button onPress={handlePress}>导航测试</Button>
    </View>
  );
}
```

### 样式系统

```tsx
import { createStyles } from '@cross-platform/core';

const styles = createStyles({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  // 平台特定样式
  h5: {
    container: {
      minHeight: '100vh'
    }
  },
  rn: {
    container: {
      paddingTop: 44
    }
  }
});
```

## 📦 包结构

| 包名 | 描述 | 版本 |
|------|------|------|
| `@cross-platform/cli` | 命令行工具 | ![npm](https://img.shields.io/npm/v/@cross-platform/cli) |
| `@cross-platform/core` | 核心运行时库 | ![npm](https://img.shields.io/npm/v/@cross-platform/core) |
| `@cross-platform/components` | 基础组件库 | ![npm](https://img.shields.io/npm/v/@cross-platform/components) |

## 🎯 支持平台

| 平台 | 状态 | 说明 |
|------|------|------|
| H5 (Web) | ✅ | 支持现代浏览器 |
| React Native | ✅ | iOS/Android 原生应用 |
| 微信小程序 | ✅ | 微信生态 |
| 支付宝小程序 | ✅ | 支付宝生态 |
| 抖音小程序 | ✅ | 字节跳动生态 |

## 🛠️ 开发命令

```bash
# 开发
pnpm dev                    # 启动示例项目
pnpm dev:example           # 启动示例项目

# 构建
pnpm build                 # 构建所有包
pnpm build:example         # 构建示例项目

# 测试
pnpm test                  # 运行测试

# 代码质量
pnpm lint                  # 代码检查
pnpm format                # 代码格式化

# 包管理
pnpm bootstrap             # 安装依赖
pnpm clean                 # 清理构建产物
```

## 📚 文档

详细文档请查看 [packages/docs/README.md](packages/docs/README.md)

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢所有贡献者和开源社区的支持！

---

如果这个项目对你有帮助，请给我们一个 ⭐️