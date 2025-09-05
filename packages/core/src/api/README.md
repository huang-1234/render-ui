# 跨平台 API

本模块提供了跨平台的 API 实现，包括路由、样式、设备信息和安全区域计算等功能，支持 React Native、Web 和小程序平台。

## 使用方式

```typescript
import { go, back, getScreenDimensions, getSafeAreaInsets } from '@cross-platform/core/api';

// 路由跳转
go('/pages/detail', { id: 123 });

// 返回上一页
back();

// 获取屏幕尺寸
const dimensions = getScreenDimensions();
console.log(`屏幕宽度: ${dimensions.width}, 高度: ${dimensions.height}`);

// 获取安全区域
const insets = getSafeAreaInsets();
console.log(`顶部安全区域: ${insets.top}px, 底部安全区域: ${insets.bottom}px`);
```

## API 说明

### 样式相关

- `rem(px: number): string` - 将像素值转换为 rem 单位
- `rpx(px: number): string` - 将像素值转换为 rpx 单位
- `px2dp(px: number): number` - 像素转换为 DP
- `dp2px(dp: number): number` - DP 转换为像素

### 设备信息

- `getPixelRatio(): number` - 获取设备像素比
- `getScreenDimensions()` - 获取屏幕尺寸
- `isIOS(): boolean` - 判断是否为 iOS 设备
- `isAndroid(): boolean` - 判断是否为 Android 设备
- `getDeviceInfo()` - 获取设备详细信息

### 安全区域

- `getSafeAreaInsets()` - 获取安全区域尺寸
- `getStatusBarHeight(): number` - 获取状态栏高度
- `getBottomSafeAreaHeight(): number` - 获取底部安全区域高度

### 路由导航

- `go(url: string, params?: Record<string, any>): void` - 页面跳转
- `back(delta?: number): void` - 返回上一页
- `redirect(url: string, params?: Record<string, any>): void` - 重定向到指定页面
- `switchTab(url: string): void` - 切换到指定 Tab
- `navigateBack(delta?: number): void` - 返回上一页

## 平台特定 API

### Web 平台特有

- `isMobile(): boolean` - 判断是否为移动设备
- `getUrlParam(name: string): string | null` - 获取 URL 参数
- `setDocumentTitle(title: string): void` - 设置页面标题

### 小程序平台特有

- `getCurrentPageUrl(): string` - 获取当前页面路径
- `getPageQuery(): Record<string, any>` - 获取页面参数
- `setNavigationBarTitle(title: string): void` - 设置页面标题

## 注意事项

1. 在 React Native 中，`getSafeAreaInsets()` 和 `getBottomSafeAreaHeight()` 在组件外无法直接获取准确值，建议在组件内使用 `useSafeAreaInsets` 钩子。

2. 小程序 API 会自动适配微信、支付宝、头条、百度和 QQ 小程序。

3. 样式单位转换在不同平台有不同实现：
   - Web: rem 基于根元素字体大小
   - React Native: 直接使用数值
   - 小程序: 使用 rpx 单位
