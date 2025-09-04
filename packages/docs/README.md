# 跨端框架文档

## 概述

这是一个基于 React、React Native、React Native Web、TypeScript、Vitest 和 Taro 的跨端框架，支持一套代码运行在 Native (iOS/Android)、H5、各大平台小程序上。

## 特性

- ✅ **真正跨端**: 一套代码主要运行于 Native、H5、各大平台小程序
- ✅ **开发体验统一**: 采用 React 语法，支持 Hooks、TypeScript
- ✅ **性能接近原生**: 通过优化手段确保各端流畅体验
- ✅ **生态丰富**: 提供完善的组件库、工具链和最佳实践

## 架构设计

```
cross-platform-framework/
├── packages/
│   ├── cli/                         # 脚手架工具
│   ├── core/                        # 核心运行时库
│   ├── react-native-renderer/       # React Native 渲染器
│   ├── h5-renderer/                 # H5 渲染器
│   ├── mini-program-renderer/       # 小程序渲染器
│   ├── components/                  # 基础组件库
│   ├── example/                     # 示例项目
│   └── docs/                        # 文档
├── scripts/                         # 构建脚本
├── package.json
└── lerna.json                      # Lerna 多包管理
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 创建新项目

```bash
npx @cross-platform/cli init my-app
cd my-app
pnpm install
```

### 3. 启动开发服务器

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:weapp

# React Native 开发
pnpm dev:rn
```

### 4. 构建项目

```bash
# 构建所有平台
pnpm build

# 构建特定平台
pnpm build:h5
pnpm build:weapp
pnpm build:rn
```

## 核心概念

### 运行时 (Runtime)

运行时提供了统一的 API 接口，屏蔽了不同平台的差异：

```typescript
import { getCurrentRuntime } from '@cross-platform/core';

const runtime = getCurrentRuntime();

// 导航
await runtime.navigateTo({ url: '/pages/detail' });

// 存储
await runtime.setStorage('key', 'value');
const value = await runtime.getStorage('key');

// 网络请求
const response = await runtime.request({
  url: 'https://api.example.com/data',
  method: 'GET'
});
```

### 组件系统

提供了一套跨端的基础组件：

```tsx
import { View, Text, Button, SafeArea } from '@cross-platform/components';

function MyComponent() {
  return (
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
  );
}
```

### 样式系统

支持跨端的样式管理：

```typescript
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
      paddingTop: 44 // iOS 状态栏
    }
  }
});
```

### 路由系统

统一的路由管理：

```typescript
import { registerRoutes, navigateTo } from '@cross-platform/core';

// 注册路由
registerRoutes([
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/detail/:id',
    component: DetailPage
  }
]);

// 导航
await navigateTo('/detail/123', { title: 'Detail Page' });
```

## 组件库

### 基础组件

| 组件 | 描述 | 支持平台 |
|------|------|----------|
| View | 容器组件 | 全平台 |
| Text | 文本组件 | 全平台 |
| Button | 按钮组件 | 全平台 |
| SafeArea | 安全区域组件 | 全平台 |

### 布局组件

| 组件 | 描述 | 支持平台 |
|------|------|----------|
| Grid | 栅格布局 | 全平台 |
| Layout | 页面布局 | 全平台 |
| WhiteSpace | 留白组件 | 全平台 |

### 导航组件

| 组件 | 描述 | 支持平台 |
|------|------|----------|
| Tabs | 标签页 | 全平台 |
| NavBar | 导航栏 | 全平台 |
| TabBar | 标签栏 | 全平台 |

## API 参考

### Runtime API

#### 导航 API

```typescript
// 跳转页面
await runtime.navigateTo({ url: '/pages/detail' });

// 重定向
await runtime.redirectTo({ url: '/pages/home' });

// 切换标签页
await runtime.switchTab({ url: '/pages/tab1' });

// 返回上一页
await runtime.navigateBack();
```

#### 存储 API

```typescript
// 异步存储
await runtime.setStorage('key', 'value');
const value = await runtime.getStorage('key');
await runtime.removeStorage('key');
await runtime.clearStorage();

// 同步存储
runtime.setStorageSync('key', 'value');
const value = runtime.getStorageSync('key');
runtime.removeStorageSync('key');
runtime.clearStorageSync();
```

#### 网络 API

```typescript
const response = await runtime.request({
  url: 'https://api.example.com/data',
  method: 'POST',
  data: { name: 'test' },
  headers: { 'Content-Type': 'application/json' }
});
```

#### 界面 API

```typescript
// 显示提示
await runtime.showToast({ title: '操作成功', icon: 'success' });

// 显示模态框
const result = await runtime.showModal({
  title: '确认',
  content: '确定要删除吗？'
});

// 显示加载
await runtime.showLoading({ title: '加载中...' });
await runtime.hideLoading();
```

### Hooks API

```typescript
import { 
  useRuntime, 
  usePlatform, 
  useSystemInfo,
  useNavigation,
  useStorage,
  useUI,
  useDevice
} from '@cross-platform/core';

function MyComponent() {
  const { runtime, platform, isReady } = useRuntime();
  const systemInfo = useSystemInfo();
  const navigation = useNavigation();
  const storage = useStorage();
  const ui = useUI();
  const device = useDevice();
  
  // 使用各种功能...
}
```

## 平台差异处理

### 条件编译

```typescript
import { usePlatform } from '@cross-platform/core';

function MyComponent() {
  const platform = usePlatform();
  
  return (
    <View>
      {platform === 'h5' && <div>H5 特有内容</div>}
      {platform === 'rn' && <Text>RN 特有内容</Text>}
      {platform === 'weapp' && <text>小程序特有内容</text>}
    </View>
  );
}
```

### 平台特定样式

```typescript
const styles = createStyles({
  default: {
    container: {
      padding: 20
    }
  },
  h5: {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }
  },
  rn: {
    container: {
      flex: 1,
      backgroundColor: '#ffffff'
    }
  },
  weapp: {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }
  }
});
```

## 最佳实践

### 1. 组件设计

- 使用统一的组件 API
- 避免平台特定的属性
- 合理使用条件渲染

### 2. 样式管理

- 使用框架提供的样式系统
- 避免直接使用平台特定的样式
- 合理使用主题变量

### 3. 状态管理

- 使用 React Hooks 进行状态管理
- 避免使用平台特定的状态管理库
- 合理使用持久化存储

### 4. 性能优化

- 合理使用懒加载
- 避免不必要的重渲染
- 优化图片和资源加载

## 常见问题

### Q: 如何处理平台特定的功能？

A: 使用条件编译或者在运行时检查平台类型：

```typescript
const platform = usePlatform();

if (platform === 'weapp') {
  // 微信小程序特定逻辑
  wx.scanCode({
    success: (res) => {
      console.log(res.result);
    }
  });
}
```

### Q: 如何自定义主题？

A: 使用样式管理器的主题功能：

```typescript
import { setTheme } from '@cross-platform/core';

setTheme({
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4'
  }
});
```

### Q: 如何添加新的组件？

A: 参考现有组件的实现方式：

```typescript
import { usePlatform, createStyles } from '@cross-platform/core';

export const MyComponent = ({ children, ...props }) => {
  const platform = usePlatform();
  const styles = createStyles({
    // 样式定义
  });
  
  // 平台特定渲染逻辑
  switch (platform) {
    case 'h5':
      return <div style={styles}>{children}</div>;
    case 'rn':
      return <View style={styles}>{children}</View>;
    default:
      return <view style={styles}>{children}</view>;
  }
};
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License