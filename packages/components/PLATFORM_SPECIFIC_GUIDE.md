# 组件平台拆分指南

本指南说明如何将跨平台组件拆分为平台特定的实现文件，以实现更好的代码组织和平台特定优化。

## 文件结构

每个组件应该遵循以下文件结构：

```
ComponentName/
├── index.tsx         # React Native 实现
├── index.web.tsx     # Web 实现
├── index.miniapp.tsx # 小程序实现
└── common.tsx        # 通用入口，根据平台动态导入
```

## 拆分步骤

1. **创建平台特定文件**：
   - `index.tsx`: 保留 React Native 的实现
   - `index.web.tsx`: 创建 Web 特定实现
   - `index.miniapp.tsx`: 创建小程序特定实现

2. **创建通用入口文件**：
   - 创建 `common.tsx` 文件，根据平台动态导入正确的实现

3. **更新导出**：
   - 在 `src/index.ts` 中更新导出路径，指向组件的 `common.tsx`

## 平台特定实现示例

### React Native 实现 (index.tsx)

```tsx
import React, { forwardRef } from 'react';
import { StyleObject } from '@cross-platform/core';
import { ComponentName as RNComponentName } from 'react-native';

export interface ComponentNameProps {
  // 属性定义...
}

const ComponentName = forwardRef<any, ComponentNameProps>((props, ref) => {
  // React Native 特定实现...
  return <RNComponentName ref={ref} {...props} />;
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

### Web 实现 (index.web.tsx)

```tsx
import React, { forwardRef } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

export interface ComponentNameProps {
  // 属性定义 (与 index.tsx 保持一致)
}

const ComponentName = forwardRef<HTMLElement, ComponentNameProps>((props, ref) => {
  // Web 特定实现...
  return <div ref={ref} {...props} />;
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

### 小程序实现 (index.miniapp.tsx)

```tsx
import React, { forwardRef } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';

export interface ComponentNameProps {
  // 属性定义 (与 index.tsx 保持一致)
}

const ComponentName = forwardRef<any, ComponentNameProps>((props, ref) => {
  // 小程序特定实现...

  // 使用 React.createElement 避免 TypeScript 错误
  return React.createElement(
    'component-name',
    {
      ref,
      ...props
    },
    props.children
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

### 通用入口 (common.tsx)

```tsx
import { Platform } from 'react-native';

// 根据平台动态导入组件
let ComponentName: any;

if (Platform.OS === 'web') {
  // Web 平台
  ComponentName = require('./index.web').default;
} else if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native 平台
  ComponentName = require('./index').default;
} else {
  // 小程序平台
  ComponentName = require('./index.miniapp').default;
}

export default ComponentName;
export type { ComponentNameProps } from './index';
```

## 注意事项

1. **保持接口一致**：
   - 确保所有平台实现具有相同的 props 接口
   - 在 `common.tsx` 中只导出一个平台的类型定义

2. **处理小程序特殊标签**：
   - 使用 `React.createElement` 而不是 JSX 语法来避免 TypeScript 错误
   - 适配 Taro 的属性命名规则（例如 `scroll-x` 到 `scrollX`）

3. **样式适配**：
   - 使用 `createStyles` 创建平台特定样式
   - 处理平台特定的样式属性和值

4. **事件处理**：
   - 适配不同平台的事件名称和参数

5. **引用转发**：
   - 确保所有平台实现都正确处理 `ref` 转发

## 更新导出

在 `src/index.ts` 中更新导出路径：

```tsx
// 从
export { default as ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';

// 改为
export { default as ComponentName } from './ComponentName/common';
export type { ComponentNameProps } from './ComponentName/common';
```

## 测试

确保在所有支持的平台上测试组件，验证功能和样式是否正确。
