# React Native 跨端组件库实现方案

基于 Ant Design Mobile 的设计理念和 API，我将为你实现一套完整的 React Native 跨端组件库。我们从基础展示组件开始，逐步实现更复杂的交互组件。

## 组件库架构设计

```
src/
├── components/
│   ├── Button/            # 按钮组件
│   ├── Icon/             # 图标组件
│   ├── Image/            # 图片组件
│   ├── Typography/       # 排版组件
│   ├── Divider/          # 分割线组件
│   ├── Grid/             # 网格组件
│   ├── Tag/              # 标签组件
│   ├── Badge/            # 徽标组件
│   ├── Card/             # 卡片组件
│   ├── List/             # 列表组件
│   ├── Tabs/             # 标签页组件
│   ├── Ellipsis/         # 省略文本组件
│   └── index.ts          # 组件库入口
├── styles/
│   ├── theme.ts          # 设计变量
│   └── utils.ts          # 样式工具
├── hooks/
│   ├── useComponentStyles.ts # 样式钩子
│   └── usePlatform.ts    # 平台检测钩子
└── utils/
    └── helpers.ts        # 工具函数
```

## 核心组件实现

### 1. Icon 图标组件

```tsx
// src/components/Icon/index.tsx
import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import { IconMap } from './iconMap';

export type IconName = keyof typeof IconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  const componentStyles = useComponentStyles('Icon', style);

  const iconStyle = {
    fontSize: size,
    color: color || componentStyles.color,
    ...componentStyles
  };

  return (
    <Text style={iconStyle}>
      {IconMap[name]}
    </Text>
  );
};

export default Icon;

// src/components/Icon/iconMap.ts
export const IconMap = {
  'check-circle': '\ue77d',
  'close-circle': '\ue77e',
  'right': '\ue7eb',
  'left': '\ue7ec',
  'up': '\ue7ee',
  'down': '\ue7ef',
  'search': '\ue752',
  'ellipsis': '\ue7fc',
  'picture': '\ue79f',
  'message': '\ue78f',
  'star': '\ue7df',
  'heart': '\ue7df',
  // 更多图标...
} as const;
```

### 2. Typography 排版组件

```tsx
// src/components/Typography/index.tsx
import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';

export interface TypographyProps {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  type = 'primary',
  size = 'md',
  bold = false,
  italic = false,
  underline = false,
  delete: deleted = false,
  center = false,
  style,
  children
}) => {
  const componentStyles = useComponentStyles('Typography', style);

  const textStyle = {
    ...componentStyles,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine: underline ? 'underline' : deleted ? 'line-through' : 'none',
    textAlign: center ? 'center' : 'auto',
    ...getSizeStyle(size),
    ...getTypeStyle(type),
  };

  return (
    <Text style={textStyle}>
      {children}
    </Text>
  );
};

// 辅助函数
const getSizeStyle = (size: string) => {
  const sizes = {
    xs: { fontSize: 12 },
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
    xl: { fontSize: 20 },
  };
  return sizes[size] || sizes.md;
};

const getTypeStyle = (type: string) => {
  const types = {
    primary: { color: '#333' },
    secondary: { color: '#666' },
    success: { color: '#00b578' },
    warning: { color: '#ff8f1f' },
    danger: { color: '#ff3141' },
  };
  return types[type] || types.primary;
};

export default Typography;
```

### 3. Divider 分割线组件

```tsx
// src/components/Divider/index.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';

export interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  color,
  size = 1,
  style
}) => {
  const componentStyles = useComponentStyles('Divider', style);

  const dividerStyle = {
    backgroundColor: color || componentStyles.backgroundColor || '#eee',
    ...(direction === 'horizontal'
      ? { height: size, width: '100%' }
      : { width: size, height: '100%' }),
    ...componentStyles
  };

  return <View style={dividerStyle} />;
};

export default Divider;
```

### 4. Grid 网格组件

```tsx
// src/components/Grid/index.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';

export interface GridProps {
  columns?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const Grid: React.FC<GridProps> = ({
  columns = 4,
  gap = 8,
  style,
  children
}) => {
  const componentStyles = useComponentStyles('Grid', style);

  const gridStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -gap / 2,
      ...componentStyles
    },
    item: {
      width: `${100 / columns}%`,
      padding: gap / 2,
    }
  });

  return (
    <View style={gridStyle.container}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={gridStyle.item}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default Grid;
```

### 5. Tag 标签组件

```tsx
// src/components/Tag/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';

export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface TagProps {
  type?: TagType;
  size?: 'small' | 'medium' | 'large';
  round?: boolean;
  closable?: boolean;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({
  type = 'default',
  size = 'medium',
  round = false,
  closable = false,
  onClose,
  style,
  textStyle,
  children
}) => {
  const componentStyles = useComponentStyles('Tag', style);

  const getTypeStyle = () => {
    const types = {
      default: { backgroundColor: '#f5f5f5', color: '#333' },
      primary: { backgroundColor: '#e6f7ff', color: '#1890ff' },
      success: { backgroundColor: '#f6ffed', color: '#52c41a' },
      warning: { backgroundColor: '#fffbe6', color: '#faad14' },
      danger: { backgroundColor: '#fff1f0', color: '#ff4d4f' },
    };
    return types[type] || types.default;
  };

  const getSizeStyle = () => {
    const sizes = {
      small: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 12 },
      medium: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 14 },
      large: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 16 },
    };
    return sizes[size] || sizes.medium;
  };

  const typeStyle = getTypeStyle();
  const sizeStyle = getSizeStyle();

  const tagStyle = {
    backgroundColor: typeStyle.backgroundColor,
    borderRadius: round ? 100 : 4,
    flexDirection: 'row',
    alignItems: 'center',
    ...sizeStyle,
    ...componentStyles
  };

  const textStyleObj = {
    color: typeStyle.color,
    fontSize: sizeStyle.fontSize,
    ...textStyle
  };

  return (
    <View style={tagStyle}>
      <Text style={textStyleObj}>{children}</Text>
      {closable && (
        <TouchableOpacity onPress={onClose} style={{ marginLeft: 4 }}>
          <Text style={{ ...textStyleObj, fontSize: sizeStyle.fontSize - 2 }}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Tag;
```

### 6. Card 卡片组件

```tsx
// src/components/Card/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import Divider from '../Divider';

export interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
  bordered?: boolean;
  hoverable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  extra,
  headerStyle,
  bodyStyle,
  footer,
  footerStyle,
  bordered = true,
  hoverable = false,
  onPress,
  style,
  children
}) => {
  const componentStyles = useComponentStyles('Card', style);

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    ...(bordered && {
      borderWidth: 1,
      borderColor: '#f0f0f0'
    }),
    ...(hoverable && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    }),
    ...componentStyles
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={cardStyle} onPress={onPress}>
      {(title || extra) && (
        <View style={[{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16
        }, headerStyle]}>
          {typeof title === 'string' ? (
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
          ) : title}
          {extra}
        </View>
      )}

      {(title || extra) && <Divider />}

      <View style={[{ padding: 16 }, bodyStyle]}>
        {children}
      </View>

      {footer && (
        <>
          <Divider />
          <View style={[{ padding: 16 }, footerStyle]}>
            {footer}
          </View>
        </>
      )}
    </Wrapper>
  );
};

export default Card;
```

## 样式系统实现

### 主题变量

```ts
// src/styles/theme.ts
export const theme = {
  // 颜色
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
  colorBorder: '#d9d9d9',
  colorBgContainer: '#ffffff',

  // 字体
  fontSizeBase: 14,
  fontSizeSm: 12,
  fontSizeLg: 16,
  fontSizeXl: 20,

  // 间距
  paddingXS: 4,
  paddingSM: 8,
  paddingMD: 16,
  paddingLG: 24,
  paddingXL: 32,

  // 边框
  borderRadiusSM: 4,
  borderRadius: 6,
  borderRadiusLG: 8,

  // 阴影
  boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

  // 动画
  motionDurationFast: '0.1s',
  motionDurationMid: '0.2s',
  motionDurationSlow: '0.3s',
};
```

### 样式钩子

```tsx
// src/hooks/useComponentStyles.ts
import { useMemo } from 'react';
import { StyleSheet, StyleProp } from 'react-native';
import { theme } from '../styles/theme';

export const useComponentStyles = (
  componentName: string,
  style?: StyleProp<any>
) => {
  return useMemo(() => {
    // 组件默认样式
    const defaultStyles = {
      Button: {
        paddingVertical: theme.paddingSM,
        paddingHorizontal: theme.paddingMD,
        borderRadius: theme.borderRadius,
        backgroundColor: theme.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      Icon: {
        color: theme.colorText,
      },
      Typography: {
        color: theme.colorText,
        fontSize: theme.fontSizeBase,
      },
      // 其他组件默认样式...
    };

    const componentDefaultStyles = defaultStyles[componentName] || {};
    return StyleSheet.flatten([componentDefaultStyles, style]);
  }, [componentName, style]);
};
```

## 使用示例

```tsx
import React from 'react';
import { View } from 'react-native';
import { Button, Icon, Typography, Divider, Grid, Tag, Card } from './components';

const App = () => {
  return (
    <View style={{ padding: 16 }}>
      <Typography type="primary" size="lg" bold>
        Ant Design Mobile RN 组件示例
      </Typography>

      <Divider style={{ marginVertical: 16 }} />

      <Grid columns={4} gap={12}>
        <Button>按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success">成功按钮</Button>
        <Button type="warning">警告按钮</Button>
      </Grid>

      <Divider style={{ marginVertical: 16 }} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Icon name="check-circle" size={24} color="green" />
        <Icon name="close-circle" size={24} color="red" />
        <Icon name="search" size={24} />
        <Icon name="star" size={24} color="gold" />
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <Card title="卡片标题" extra={<Tag>标签</Tag>}>
        <Typography>
          卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容
        </Typography>
        <Typography type="secondary">
          次要文本内容
        </Typography>
      </Card>
    </View>
  );
};

export default App;
```

## 跨平台适配策略

1. **平台检测**
   ```tsx
   // src/hooks/usePlatform.ts
   import { Platform } from 'react-native';

   export const usePlatform = () => {
     return {
       isWeb: Platform.OS === 'web',
       isIOS: Platform.OS === 'ios',
       isAndroid: Platform.OS === 'android',
       OS: Platform.OS,
     };
   };
   ```

2. **平台特定样式**
   ```tsx
   const styles = StyleSheet.create({
     container: {
       ...Platform.select({
         web: {
           cursor: 'pointer',
           userSelect: 'none',
         },
         ios: {
           shadowColor: '#000',
           shadowOffset: { width: 0, height: 2 },
           shadowOpacity: 0.1,
           shadowRadius: 4,
         },
         android: {
           elevation: 4,
         },
       }),
     },
   });
   ```

3. **平台特定组件**
   ```tsx
   // 使用 .web.tsx, .ios.tsx, .android.tsx 后缀
   // MyComponent.web.tsx
   import React from 'react';
   import { View, Text } from 'react-native';

   const MyComponent = () => (
     <View>
       <Text>Web 特定实现</Text>
     </View>
   );
   export default MyComponent;

   // MyComponent.native.tsx
   import React from 'react';
   import { View, Text } from 'react-native';

   const MyComponent = () => (
     <View>
       <Text>原生平台实现</Text>
     </View>
   );
   export default MyComponent;
   ```

## 组件库发布准备

1. **配置 package.json**
   ```json
   {
     "name": "@your-org/rn-antd-mobile",
     "version": "0.1.0",
     "main": "dist/index.js",
     "module": "dist/index.esm.js",
     "types": "dist/index.d.ts",
     "files": ["dist"],
     "peerDependencies": {
       "react": ">=16.8.0",
       "react-native": ">=0.60.0",
       "react-native-web": ">=0.12.0"
     }
   }
   ```

2. **构建脚本**
   ```json
   {
     "scripts": {
       "build": "tsc && rollup -c",
       "prepublishOnly": "npm run build"
     }
   }
   ```

3. **Rollup 配置**
   ```js
   // rollup.config.js
   import resolve from '@rollup/plugin-node-resolve';
   import commonjs from '@rollup/plugin-commonjs';
   import typescript from '@rollup/plugin-typescript';
   import peerDepsExternal from 'rollup-plugin-peer-deps-external';

   export default {
     input: 'src/index.ts',
     output: [
       {
         file: 'dist/index.js',
         format: 'cjs',
       },
       {
         file: 'dist/index.esm.js',
         format: 'esm',
       },
     ],
     plugins: [
       peerDepsExternal(),
       resolve(),
       commonjs(),
       typescript({ tsconfig: './tsconfig.json' }),
     ],
   };
   ```

## 总结

这个实现方案提供了完整的 React Native 跨端组件库，包含：

1. 基础展示组件（Icon, Typography, Divider）
2. 布局组件（Grid）
3. 数据展示组件（Tag, Card）
4. 完整的样式系统和主题支持
5. 跨平台适配策略
6. 组件库打包和发布配置

组件设计遵循 Ant Design Mobile 的 API 规范和设计理念，同时针对 React Native 平台进行了优化。通过使用 `react-native-web`，这些组件可以在 Web 平台上无缝运行。

下一步可以继续实现更复杂的交互组件：
- Input 输入框
- Picker 选择器
- Modal 对话框
- Swiper 轮播图
- PullRefresh 下拉刷新
- InfiniteScroll 无限滚动

每个组件都可以按照类似的模式实现，保持 API 一致性和跨平台兼容性。