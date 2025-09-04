# 跨端渲染器实现文档

本文档描述了三端渲染器的实现情况和使用方法。

## 概述

跨端框架包含三个核心渲染器：

1. **H5 渲染器** (`@cross-platform/h5-renderer`) - 用于 Web 浏览器
2. **小程序渲染器** (`@cross-platform/mini-program-renderer`) - 用于各种小程序平台
3. **React Native 渲染器** (`@cross-platform/react-native-renderer`) - 用于 iOS/Android 原生应用

## 架构设计

每个渲染器都遵循统一的架构模式：

```md
渲染器/
├── src/
│   ├── index.ts          # 入口文件
│   ├── runtime.ts        # 运行时实现
│   ├── router.ts         # 路由管理
│   ├── styles.ts         # 样式管理
│   ├── types.ts          # 类型定义
│   ├── components/       # 平台特定组件
│   └── apis/            # 平台 API 实现
├── package.json
├── tsconfig.json
└── README.md
```

## 核心功能

### 1. 运行时 (Runtime)

每个渲染器都实现了统一的 `Runtime` 接口：

```typescript
interface Runtime {
  platform: string;
  isDevelopment: boolean;
  isProduction: boolean;

  // 导航
  navigateTo(options: NavigateOptions): void;
  redirectTo(options: NavigateOptions): void;
  switchTab(options: NavigateOptions): void;

  // 系统信息
  getSystemInfo(): Promise<SystemInfo>;

  // 网络请求
  request(options: RequestOptions): Promise<any>;

  // 存储
  setStorage(key: string, data: any): Promise<void>;
  getStorage(key: string): Promise<any>;
}
```

### 2. 路由管理 (Router)

统一的路由管理接口：

```typescript
class Router {
  static registerRoutes(routes: RouteConfig[]): void;
  static navigateTo(path: string, params?: Record<string, any>): void;
  static redirectTo(path: string, params?: Record<string, any>): void;
  static goBack(): void;
  static getCurrentRoute(): RouteInfo | null;
  static addListener(listener: (route: RouteInfo) => void): () => void;
}
```

### 3. 样式管理 (StyleManager)

跨端样式适配：

```typescript
class StyleManager {
  create<T>(styles: T, componentName: string): T;
  adaptStyles(styles: Record<string, any>): Record<string, any>;
  createResponsiveStyles(styles: Record<string, any>, breakpoints: Record<string, number>): Record<string, any>;
}
```

## 平台特性

### H5 渲染器

**特点：**
- 基于标准 Web API
- 支持响应式设计
- CSS-in-JS 样式系统
- History API 路由
- LocalStorage 存储

**样式适配：**
- 数字值自动添加 `px` 单位
- React Native 属性转换为 CSS 属性
- 支持 CSS 环境变量（安全区域）
- 媒体查询响应式支持

**组件映射：**
- `View` → `div`
- `Text` → `span`
- `Image` → `img`
- `ScrollView` → `div` with overflow

### 小程序渲染器

**特点：**
- 支持多个小程序平台（微信、支付宝、字节、百度）
- 自动平台检测
- rpx 单位转换
- 小程序原生 API 调用

**样式适配：**
- 数字值转换为 `rpx` 单位（1px = 2rpx）
- 样式属性转换为小程序支持的格式
- 字体粗细标准化
- 阴影效果适配

**平台差异处理：**
```typescript
// 自动检测平台并调用对应 API
switch (platform) {
  case 'weapp': return wx;
  case 'alipay': return my;
  case 'tt': return tt;
  case 'swan': return swan;
}
```

### React Native 渲染器

**特点：**
- iOS/Android 原生支持
- StyleSheet 样式系统
- React Navigation 集成
- AsyncStorage 存储
- 原生设备 API

**样式适配：**
- 移除 CSS 单位，转换为数字
- CSS 属性转换为 React Native 属性
- transform 字符串解析为数组格式
- 平台特定样式支持

**依赖管理：**
- 核心依赖：React Native
- 可选依赖：AsyncStorage、DeviceInfo、NetInfo 等
- 自动降级处理

## 使用示例

### 统一的应用入口

```typescript
import { createRuntime } from '@cross-platform/core';
import { H5Runtime } from '@cross-platform/h5-renderer';
import { MiniProgramRuntime } from '@cross-platform/mini-program-renderer';
import { ReactNativeRuntime } from '@cross-platform/react-native-renderer';

// 根据平台创建对应的运行时
const runtime = createRuntime(platform);

// 注册路由
runtime.router.registerRoutes([
  { path: '/', component: HomePage },
  { path: '/profile', component: ProfilePage }
]);

// 创建样式
const styles = runtime.styleManager.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  }
}, 'App');
```

### 跨端组件开发

```typescript
import React from 'react';
import { useRuntime } from '@cross-platform/core';

const MyComponent: React.FC = () => {
  const { platform, styleManager } = useRuntime();

  const styles = styleManager.create({
    container: {
      padding: 16,
      backgroundColor: platform === 'rn' ? '#fff' : '#f5f5f5'
    },
    text: {
      fontSize: 16,
      color: '#333'
    }
  }, 'MyComponent');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        当前平台: {platform}
      </Text>
    </View>
  );
};
```

## 构建和部署

### 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建所有渲染器
pnpm run build
```

### 平台特定构建

```bash
# H5 构建
cd packages/h5-renderer && npm run build

# 小程序构建
cd packages/mini-program-renderer && npm run build

# React Native 构建
cd packages/react-native-renderer && npm run build
```

## 测试

每个渲染器都包含完整的测试套件：

```bash
# 运行所有测试
pnpm test

# 运行特定渲染器测试
cd packages/h5-renderer && npm test
```

## 扩展性

### 添加新平台

1. 创建新的渲染器包
2. 实现 `Runtime` 接口
3. 实现 `Router` 和 `StyleManager`
4. 添加平台特定组件
5. 更新核心包的平台检测逻辑

### 自定义组件

```typescript
// 创建跨端组件
import { BaseComponent } from '@cross-platform/core';

class CustomButton extends BaseComponent {
  render() {
    const { platform } = this.runtime;

    switch (platform) {
      case 'h5':
        return <button {...this.props} />;
      case 'weapp':
        return <button {...this.adaptPropsForMiniProgram()} />;
      case 'rn':
        return <TouchableOpacity {...this.adaptPropsForRN()} />;
    }
  }
}
```

## 性能优化

### H5 优化
- 代码分割和懒加载
- CSS 优化和压缩
- 图片懒加载
- Service Worker 缓存

### 小程序优化
- 分包加载
- setData 优化
- 图片压缩
- 预加载策略

### React Native 优化
- FlatList 虚拟滚动
- 图片缓存
- 内存管理
- 原生模块优化

## 最佳实践

1. **统一的 API 设计** - 保持各平台 API 的一致性
2. **渐进式增强** - 优先保证基础功能，再添加平台特性
3. **性能监控** - 监控各平台的性能指标
4. **错误处理** - 统一的错误处理和降级策略
5. **文档维护** - 保持文档与代码同步更新

## 总结

三端渲染器的实现为跨端开发提供了强大的基础设施：

- ✅ **统一的 API** - 一套代码，多端运行
- ✅ **平台适配** - 自动处理平台差异
- ✅ **性能优化** - 针对各平台的优化策略
- ✅ **扩展性** - 易于添加新平台和功能
- ✅ **开发体验** - 完整的工具链和调试支持

通过这套渲染器系统，开发者可以专注于业务逻辑的实现，而无需关心底层的平台差异处理。