# @cross-platform/react-native-renderer

React Native 渲染器，用于在 iOS 和 Android 原生应用中运行跨端应用。

## 特性

- 📱 iOS 和 Android 原生支持
- 🎨 StyleSheet 样式系统
- 🧭 React Navigation 路由集成
- 💾 AsyncStorage 存储支持
- 🔗 Fetch API 网络请求
- 📐 安全区域适配
- 🔔 原生 UI 组件（Alert、Toast 等）
- 📷 设备信息和权限管理

## 安装

```bash
pnpm install @cross-platform/react-native-renderer

# 安装可选依赖
pnpm install @react-native-async-storage/async-storage
pnpm install react-native-iphone-x-helper
pnpm install react-native-device-info
pnpm install @react-native-netinfo/netinfo
pnpm install @react-native-clipboard/clipboard
```

## 使用

```tsx
import {
  ReactNativeRuntime,
  ReactNativeRouter,
  ReactNativeStyleManager
} from '@cross-platform/react-native-renderer';
import { createRuntime } from '@cross-platform/core';
import { NavigationContainer } from '@react-navigation/native';

// 创建运行时
const runtime = createRuntime('rn');

// 设置导航引用
const navigationRef = useRef();
ReactNativeRuntime.setNavigationRef(navigationRef.current);
ReactNativeRouter.setNavigationRef(navigationRef.current);

// 注册路由
ReactNativeRouter.registerRoutes([
  {
    path: '/home',
    component: HomeScreen
  },
  {
    path: '/profile',
    component: ProfileScreen
  }
]);

// 使用样式管理器
const styles = ReactNativeStyleManager.getInstance().create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  }
}, 'MyComponent');

// App 组件
function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      {/* 你的应用内容 */}
    </NavigationContainer>
  );
}
```

## API

### ReactNativeRuntime

提供 React Native 平台的运行时能力：

- `navigateTo(options)` - 页面导航
- `redirectTo(options)` - 页面重定向
- `goBack()` - 返回上一页
- `getSystemInfo()` - 获取系统信息
- `request(options)` - 网络请求
- `setStorage(key, data)` - 设置存储
- `getStorage(key)` - 获取存储
- `showToast(options)` - 显示提示
- `showModal(options)` - 显示模态框
- `openUrl(url)` - 打开外部链接
- `getClipboardData()` - 获取剪贴板内容
- `setClipboardData(data)` - 设置剪贴板内容
- `vibrate(pattern)` - 震动
- `getNetworkType()` - 获取网络类型

### ReactNativeRouter

提供 React Native 平台的路由管理：

- `init(navigationRef)` - 初始化路由
- `registerRoutes(routes)` - 注册路由
- `navigateTo(path, params)` - 导航到页面
- `redirectTo(path, params)` - 重定向到页面
- `goBack()` - 返回上一页
- `goBackTo(path)` - 返回到指定页面
- `goBackToRoot()` - 返回到根页面

### ReactNativeStyleManager

提供 React Native 平台的样式管理：

- `create(styles, componentName)` - 创建样式表
- `adaptStyles(styles)` - 适配样式
- `createResponsiveStyles(styles, breakpoints)` - 创建响应式样式
- `getPlatformStyles(iosStyle, androidStyle)` - 获取平台特定样式
- `mergeStyles(...styles)` - 合并样式

## 样式适配

React Native 渲染器会自动处理样式适配：

- 移除 CSS 单位（px、rem、em 等）
- 转换 CSS 属性为 React Native 支持的属性
- 处理 transform、boxShadow 等复杂属性
- 支持平台特定样式

```tsx
// 输入样式
const styles = {
  container: {
    width: '100px',      // 转换为 100
    height: '2rem',      // 转换为 32
    marginHorizontal: 10, // 保持不变
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // 转换为 shadowColor 等
    transform: 'translateX(10px) rotate(45deg)' // 转换为数组格式
  }
};
```

## 组件

### View

基础视图组件，对应 React Native 的 `View`。

```tsx
import { View } from '@cross-platform/react-native-renderer';

<View style={styles.container}>
  <Text>Hello World</Text>
</View>
```

### Text

文本组件，对应 React Native 的 `Text`。

```tsx
import { Text } from '@cross-platform/react-native-renderer';

<Text
  numberOfLines={2}
  ellipsizeMode="tail"
  selectable
>
  这是一段很长的文本...
</Text>
```

### TouchableOpacity

可触摸组件，对应 React Native 的 `TouchableOpacity`。

```tsx
import { TouchableOpacity } from '@cross-platform/react-native-renderer';

<TouchableOpacity
  activeOpacity={0.7}
  onPress={handlePress}
>
  <Text>点击我</Text>
</TouchableOpacity>
```

### SafeAreaView

安全区域组件，自动处理刘海屏等适配。

```tsx
import { SafeAreaView } from '@cross-platform/react-native-renderer';

<SafeAreaView edges={['top', 'bottom']}>
  <View>内容区域</View>
</SafeAreaView>
```

### TextInput

文本输入组件，对应 React Native 的 `TextInput`。

```tsx
import { TextInput } from '@cross-platform/react-native-renderer';

<TextInput
  value={text}
  onChangeText={setText}
  placeholder="请输入内容"
  keyboardType="email-address"
  returnKeyType="done"
/>
```

## 导航集成

与 React Navigation 集成使用：

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  const navigationRef = useRef();

  useEffect(() => {
    ReactNativeRuntime.setNavigationRef(navigationRef.current);
    ReactNativeRouter.init(navigationRef.current);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 平台差异

自动处理 iOS 和 Android 平台差异：

```tsx
// 平台特定样式
const styles = StyleManager.getInstance().getPlatformStyles(
  // iOS 样式
  {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  // Android 样式
  {
    elevation: 4
  }
);

// 平台特定逻辑
if (Platform.OS === 'ios') {
  // iOS 特定代码
} else {
  // Android 特定代码
}
```

## 性能优化

- 使用 StyleSheet.create 创建样式
- 支持 FlatList 虚拟滚动
- 自动处理图片缓存
- 内存管理和优化

## 依赖要求

- React Native 0.60+
- React 16.8+
- React Navigation 6+ (可选)

## 许可证

MIT