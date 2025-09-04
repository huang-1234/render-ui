# @cross-platform/h5-renderer

H5 渲染器，用于在 Web 浏览器中运行跨端应用。

## 特性

- 🌐 完整的 Web 浏览器支持
- 📱 响应式设计和移动端适配
- 🎨 CSS-in-JS 样式系统
- 🧭 基于 History API 的路由
- 💾 LocalStorage 存储支持
- 🔗 Fetch API 网络请求
- 🔒 安全区域适配（CSS env()）

## 安装

```bash
npm install @cross-platform/h5-renderer
```

## 使用

```tsx
import { H5Runtime, H5Router, H5StyleManager } from '@cross-platform/h5-renderer';
import { createRuntime } from '@cross-platform/core';

// 创建运行时
const runtime = createRuntime('h5');

// 初始化路由
H5Router.init();

// 注册路由
H5Router.registerRoutes([
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/profile',
    component: ProfilePage
  }
]);

// 使用样式管理器
const styles = H5StyleManager.getInstance().create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  }
}, 'MyComponent');
```

## API

### H5Runtime

提供 H5 平台的运行时能力：

- `navigateTo(options)` - 页面导航
- `getSystemInfo()` - 获取系统信息
- `request(options)` - 网络请求
- `setStorage(key, data)` - 设置存储
- `getStorage(key)` - 获取存储

### H5Router

提供 H5 平台的路由管理：

- `registerRoutes(routes)` - 注册路由
- `navigateTo(path, params)` - 导航到页面
- `redirectTo(path, params)` - 重定向到页面
- `goBack()` - 返回上一页

### H5StyleManager

提供 H5 平台的样式管理：

- `create(styles, componentName)` - 创建样式
- `adaptStyles(styles)` - 适配样式
- `createResponsiveStyles(styles, breakpoints)` - 创建响应式样式

## 组件

### View

基础视图组件，对应 HTML 的 `div` 元素。

```tsx
import { View } from '@cross-platform/h5-renderer';

<View style={{ padding: 20 }}>
  <Text>Hello World</Text>
</View>
```

### Text

文本组件，对应 HTML 的 `span` 元素。

```tsx
import { Text } from '@cross-platform/h5-renderer';

<Text numberOfLines={2} ellipsizeMode="tail">
  这是一段很长的文本...
</Text>
```

### SafeAreaView

安全区域组件，自动处理刘海屏等适配。

```tsx
import { SafeAreaView } from '@cross-platform/h5-renderer';

<SafeAreaView edges={['top', 'bottom']}>
  <View>内容区域</View>
</SafeAreaView>
```

## 样式适配

H5 渲染器会自动将跨端样式转换为标准的 CSS：

- 数字值自动添加 `px` 单位
- React Native 样式属性转换为 CSS 属性
- 支持 Flexbox 布局
- 支持响应式断点

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT