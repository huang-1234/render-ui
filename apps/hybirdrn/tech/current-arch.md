# HybridRN 跨端组件库架构设计文档

## 📋 目录
1. [项目概述](#项目概述)
2. [架构设计](#架构设计)
3. [技术栈](#技术栈)
4. [目录结构](#目录结构)
5. [核心模块](#核心模块)
6. [构建配置](#构建配置)
7. [跨平台策略](#跨平台策略)
8. [性能优化](#性能优化)
9. [开发规范](#开发规范)
10. [扩展性设计](#扩展性设计)

## 项目概述

HybridRN 是一个基于 React Native 的跨端组件库，支持 iOS、Android 和 Web 三个平台。项目采用模块化设计，提供了丰富的基础组件和高级组件，具有统一的 API 设计和优秀的性能表现。

### 核心特性
- 🎯 **跨平台兼容**：一套代码，三端运行（iOS/Android/Web）
- 🧩 **模块化设计**：组件独立，按需引入
- 🎨 **主题系统**：统一的设计语言和主题配置
- ⚡ **高性能**：虚拟化列表、懒加载等性能优化
- 🔧 **TypeScript**：完整的类型定义和智能提示
- 📦 **多构建目标**：支持 CJS、ESM 多种模块格式

## 架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    HybridRN 组件库                           │
├─────────────────────────────────────────────────────────────┤
│  应用层 (Application Layer)                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   iOS App       │  │  Android App    │  │    Web App      ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  组件层 (Component Layer)                                    │
│  ┌─────────────────┐  ┌─────────────────┐                    │
│  │  基础组件        │  │  高级组件        │                    │
│  │  - Box          │  │  - VirtualList  │                    │
│  │  - Text         │  │  - TinyImage    │                    │
│  │  - Button       │  │  - ...          │                    │
│  │  - Input        │  │                 │                    │
│  │  - ...          │  │                 │                    │
│  └─────────────────┘  └─────────────────┘                    │
├─────────────────────────────────────────────────────────────┤
│  核心层 (Core Layer)                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   主题系统       │  │   Hooks系统     │  │   工具函数       ││
│  │  - theme.ts     │  │  - useStyles    │  │  - utils/       ││
│  │  - 设计令牌      │  │  - 自定义Hooks  │  │  - 性能优化      ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  平台适配层 (Platform Adaptation Layer)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │  React Native   │  │  React Native   │  │ React Native    ││
│  │  (iOS/Android)  │  │  Web            │  │  + 原生模块      ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 分层设计原则

1. **应用层**：具体的业务应用，使用组件库构建界面
2. **组件层**：可复用的 UI 组件，分为基础组件和高级组件
3. **核心层**：提供主题、样式、工具等基础能力
4. **平台适配层**：处理不同平台的差异化逻辑

## 技术栈

### 核心技术
- **React Native**: 0.81.1 - 跨平台移动应用框架
- **React**: 19.1.1 - UI 库
- **TypeScript**: 5.8.3 - 类型系统
- **React Native Web**: 0.21.1 - Web 平台支持

### 构建工具
- **Rollup**: 4.9.6 - 组件库打包
- **Webpack**: 5.101.3 - Web 应用构建
- **Babel**: 7.28.3 - JavaScript 编译
- **Metro**: 0.81.1 - React Native 打包器

### 开发工具
- **Jest**: 测试框架
- **Vitest**: 2.1.5 - 现代化测试工具
- **ESLint**: 代码规范检查

## 目录结构

```
hybirdrn/
├── src/                          # 源代码目录
│   ├── components/               # 基础组件
│   │   ├── Box/                 # 布局容器组件
│   │   ├── Text/                # 文本组件
│   │   ├── Button/              # 按钮组件
│   │   ├── Input/               # 输入框组件
│   │   ├── Modal/               # 模态框组件
│   │   ├── Tabs/                # 标签页组件
│   │   ├── Icon/                # 图标组件
│   │   ├── Swiper/              # 轮播组件
│   │   ├── Grid/                # 网格组件
│   │   ├── Card/                # 卡片组件
│   │   ├── Tag/                 # 标签组件
│   │   ├── Divider/             # 分割线组件
│   │   ├── Typography/          # 排版组件
│   │   ├── SideBar/             # 侧边栏组件
│   │   ├── Svg/                 # SVG 组件
│   │   ├── Picker/              # 选择器组件
│   │   ├── PullRefresh/         # 下拉刷新组件
│   │   ├── InfiniteScroll/      # 无限滚动组件
│   │   └── index.ts             # 组件导出
│   ├── pro-components/          # 高级组件
│   │   ├── VirtualizedList/     # 虚拟化列表
│   │   ├── TinyImage/           # 图片组件
│   │   └── index.ts             # 高级组件导出
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useComponentStyles.ts # 样式 Hook
│   │   └── index.ts             # Hooks 导出
│   ├── styles/                  # 样式系统
│   │   └── theme.ts             # 主题配置
│   ├── utils/                   # 工具函数
│   │   ├── imageProcessor.ts    # 图片处理
│   │   ├── performanceUtils.ts  # 性能优化
│   │   └── waterfallLayout.ts   # 瀑布流布局
│   └── index.ts                 # 主入口文件
├── example/                     # 示例应用
│   ├── App.tsx                  # 主应用
│   ├── ComponentShowcase.tsx    # 组件展示
│   ├── SideBar/                 # 侧边栏示例
│   ├── VirtualList/             # 虚拟列表示例
│   ├── index.html               # Web 入口
│   ├── index.js                 # RN 入口
│   └── index.web.js             # Web 入口
├── tech/                        # 技术文档
│   └── current-arch.md          # 架构文档
├── dist/                        # 构建输出
├── __mocks__/                   # 测试模拟
├── package.json                 # 项目配置
├── tsconfig.json                # TypeScript 配置
├── rollup.config.js             # Rollup 配置
├── webpack.config.js            # Webpack 配置
├── babel.config.js              # Babel 配置
├── metro.config.js              # Metro 配置
├── jest.config.js               # Jest 配置
└── vitest.config.ts             # Vitest 配置
```

## 核心模块

### 1. 组件系统

#### 基础组件 (src/components/)
- **Box**: 布局容器，支持 Flexbox 布局
- **Text**: 文本显示，支持多种样式
- **Button**: 按钮组件，支持多种状态
- **Input**: 输入框，支持验证和格式化
- **Modal**: 模态框，支持多种位置和动画
- **Tabs**: 标签页，支持水平和垂直布局
- **Icon**: 图标组件，支持 SVG 和字体图标
- **其他**: Swiper、Grid、Card、Tag、Divider 等

#### 高级组件 (src/pro-components/)
- **VirtualizedList**: 虚拟化列表，支持瀑布流布局
- **TinyImage**: 图片组件，支持懒加载、域名逃生、压缩等

### 2. 主题系统 (src/styles/theme.ts)

```typescript
export const theme = {
  // 颜色系统
  colorPrimary: '#1890ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#f5222d',
  
  // 间距系统
  spacingXs: 4,
  spacingSmall: 8,
  spacingMedium: 16,
  spacingLarge: 24,
  
  // 字体系统
  fontSizeBase: 14,
  fontSizeLarge: 18,
  fontWeightNormal: "400",
  fontWeightBold: "600",
  
  // 圆角系统
  borderRadiusBase: 6,
  borderRadiusLarge: 8,
  
  // 动画系统
  animationDurationBase: '0.3s',
  
  // 阴影系统
  shadowBase: '0 2px 8px rgba(0, 0, 0, 0.15)',
};
```

### 3. Hooks 系统 (src/hooks/)

#### useComponentStyles
统一的样式管理 Hook，为每个组件提供默认样式和主题支持：

```typescript
export const useComponentStyles = <T>(
  componentName: ComponentName, 
  style?: StyleProp<T>
) => {
  return useMemo(() => {
    const componentDefaultStyles = defaultStyles[componentName] || {};
    return StyleSheet.flatten([componentDefaultStyles, style]);
  }, [componentName, style]);
};
```

### 4. 工具函数 (src/utils/)

- **imageProcessor.ts**: 图片处理工具
- **performanceUtils.ts**: 性能优化工具
- **waterfallLayout.ts**: 瀑布流布局算法

## 构建配置

### 1. Rollup 配置 (rollup.config.js)
用于构建组件库，支持 CJS 和 ESM 两种格式：

```javascript
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false,
      browser: true,
      dedupe: ['react-native', 'react', 'react-dom']
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
  external: ['react-native', 'react-native-web']
};
```

### 2. Webpack 配置 (webpack.config.js)
用于 Web 平台的示例应用构建：

```javascript
module.exports = {
  mode: 'development',
  entry: './example/index.web.js',
  resolve: {
    extensions: ['.web.js', '.js', '.web.tsx', '.tsx', '.web.ts', '.ts'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  // ...其他配置
};
```

### 3. Babel 配置 (babel.config.js)
支持多环境编译：

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    web: {
      plugins: ['react-native-web'],
    },
  },
  plugins: [
    ['babel-plugin-react-native-web', { commonjs: true }]
  ],
};
```

## 跨平台策略

### 1. 平台检测
使用 React Native 的 Platform API 进行平台特定逻辑处理：

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web 特定逻辑
} else {
  // Native 特定逻辑
}
```

### 2. 文件扩展名策略
支持平台特定文件：
- `.web.js` - Web 平台专用
- `.ios.js` - iOS 平台专用
- `.android.js` - Android 平台专用
- `.js` - 通用文件

### 3. 依赖管理
- **react-native-web**: 将 React Native 组件转换为 Web 组件
- **条件导入**: 根据平台动态导入不同的实现

## 性能优化

### 1. 虚拟化列表
VirtualizedList 组件实现了高性能的虚拟滚动：
- 只渲染可视区域内的元素
- 支持瀑布流布局
- 内存回收机制
- 异步布局计算

### 2. 图片优化
TinyImage 组件提供多种优化策略：
- 懒加载
- 域名逃生
- 图片压缩
- WebP 转换

### 3. 样式优化
- 使用 StyleSheet.create 创建样式
- 避免内联样式
- 样式缓存机制

### 4. 包体积优化
- Tree Shaking 支持
- 按需导入
- 外部依赖处理

## 开发规范

### 1. 组件开发规范
- 每个组件独立目录
- 包含 index.tsx、style.ts、__tests__ 目录
- 完整的 TypeScript 类型定义
- 单元测试覆盖

### 2. 命名规范
- 组件名：PascalCase
- 文件名：camelCase
- 样式名：camelCase
- 常量：UPPER_SNAKE_CASE

### 3. 导出规范
- 默认导出组件
- 命名导出类型定义
- 统一的 index.ts 文件管理导出

### 4. 测试规范
- 每个组件必须有单元测试
- 使用 Jest + Testing Library
- 覆盖主要功能和边界情况

## 扩展性设计

### 1. 插件系统
支持通过插件扩展组件功能：
- 主题插件
- 国际化插件
- 动画插件

### 2. 自定义主题
完整的主题定制能力：
- 颜色系统
- 字体系统
- 间距系统
- 动画系统

### 3. 组件扩展
- 继承现有组件
- 组合多个组件
- 自定义 Hooks

### 4. 平台扩展
- 支持新平台适配
- 平台特定组件
- 渐进式增强

## 总结

HybridRN 组件库采用了现代化的架构设计，具有以下优势：

1. **跨平台兼容性**：一套代码支持三端运行
2. **模块化设计**：组件独立，易于维护和扩展
3. **性能优化**：多种性能优化策略确保流畅体验
4. **开发体验**：完整的 TypeScript 支持和开发工具链
5. **可扩展性**：灵活的插件系统和主题定制能力

这种架构设计为组件库的长期发展和维护提供了坚实的基础，能够适应不断变化的业务需求和技术发展。