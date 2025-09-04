# @cross-platform/mini-program-renderer

小程序渲染器，支持微信小程序、支付宝小程序、字节跳动小程序、百度小程序等多个平台。

## 特性

- 🔄 多小程序平台支持（微信、支付宝、字节、百度）
- 📱 原生小程序组件适配
- 🎨 rpx 单位自动转换
- 🧭 小程序路由系统
- 💾 小程序存储 API
- 🔗 小程序网络请求
- 🎯 平台差异自动处理

## 支持平台

- 微信小程序 (weapp)
- 支付宝小程序 (alipay)
- 字节跳动小程序 (tt)
- 百度小程序 (swan)

## 安装

```bash
npm install @cross-platform/mini-program-renderer
```

## 使用

```tsx
import { 
  MiniProgramRuntime, 
  MiniProgramRouter, 
  MiniProgramStyleManager 
} from '@cross-platform/mini-program-renderer';
import { createRuntime } from '@cross-platform/core';

// 创建运行时
const runtime = createRuntime('weapp'); // 或 'alipay', 'tt', 'swan'

// 初始化路由
MiniProgramRouter.init();

// 注册路由
MiniProgramRouter.registerRoutes([
  {
    path: '/pages/index/index',
    component: IndexPage
  },
  {
    path: '/pages/profile/index',
    component: ProfilePage
  }
]);

// 使用样式管理器
const styles = MiniProgramStyleManager.getInstance().create({
  container: {
    padding: 20, // 自动转换为 40rpx
    backgroundColor: '#f5f5f5'
  }
}, 'MyComponent');
```

## API

### MiniProgramRuntime

提供小程序平台的运行时能力：

- `navigateTo(options)` - 页面导航
- `redirectTo(options)` - 页面重定向
- `switchTab(options)` - Tab 页面切换
- `getSystemInfo()` - 获取系统信息
- `request(options)` - 网络请求
- `setStorage(key, data)` - 设置存储
- `getStorage(key)` - 获取存储
- `showToast(options)` - 显示提示
- `showModal(options)` - 显示模态框

### MiniProgramRouter

提供小程序平台的路由管理：

- `registerRoutes(routes)` - 注册路由
- `navigateTo(path, params)` - 导航到页面
- `redirectTo(path, params)` - 重定向到页面
- `switchTab(path)` - 切换到 Tab 页面
- `goBack(delta)` - 返回上一页
- `reLaunch(path, params)` - 重新启动应用

### MiniProgramStyleManager

提供小程序平台的样式管理：

- `create(styles, componentName)` - 创建样式
- `adaptStyles(styles)` - 适配样式（px 转 rpx）
- `generateInlineStyle(styleObject)` - 生成内联样式字符串

## 样式适配

小程序渲染器会自动处理样式适配：

- 数字值自动转换为 `rpx` 单位（1px = 2rpx）
- React Native 样式属性转换为小程序支持的属性
- 字体粗细值标准化
- 阴影效果适配

```tsx
// 输入样式
const styles = {
  container: {
    width: 100,        // 转换为 200rpx
    height: '50px',    // 转换为 100rpx
    marginHorizontal: 10, // 转换为 margin-left: 20rpx; margin-right: 20rpx
    elevation: 2       // 转换为 box-shadow
  }
};
```

## 组件

### View

基础视图组件，对应小程序的 `view` 组件。

```tsx
import { View } from '@cross-platform/mini-program-renderer';

<View 
  className="container"
  hover-class="hover"
  bindtap={handleTap}
>
  内容
</View>
```

### Text

文本组件，对应小程序的 `text` 组件。

```tsx
import { Text } from '@cross-platform/mini-program-renderer';

<Text selectable decode>
  可选择的文本
</Text>
```

### Button

按钮组件，对应小程序的 `button` 组件。

```tsx
import { Button } from '@cross-platform/mini-program-renderer';

<Button 
  type="primary"
  size="default"
  open-type="getUserInfo"
  bindgetuserinfo={handleGetUserInfo}
>
  获取用户信息
</Button>
```

## 平台差异处理

渲染器会自动检测当前运行的小程序平台，并调用对应的 API：

```tsx
// 自动检测平台并调用对应 API
runtime.showToast({ title: '操作成功' });

// 微信小程序：wx.showToast
// 支付宝小程序：my.showToast
// 字节跳动小程序：tt.showToast
// 百度小程序：swan.showToast
```

## 配置文件

### app.json

```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/index"
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/profile/index",
        "text": "我的"
      }
    ]
  }
}
```

### project.config.json (微信小程序)

```json
{
  "appid": "your-app-id",
  "projectname": "your-project-name",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true
  }
}
```

## 许可证

MIT