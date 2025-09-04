// 基础组件
export { default as View } from './View/common';
export type { ViewProps } from './View/common';

export { default as Text, Heading1, Heading2, Heading3, Heading4, Paragraph, Caption, Link } from './Text/common';
export type { TextProps } from './Text/common';

export { default as Button } from './Button/common';
export type { ButtonProps } from './Button/common';

export { default as SafeArea, useSafeAreaInsets } from './SafeArea/common';
export type { SafeAreaProps } from './SafeArea/common';

export { default as Image } from './Image/common';
export type { ImageProps } from './Image/common';

export { default as ScrollView } from './ScrollView/common';
export type { ScrollViewProps } from './ScrollView/common';

export { default as TouchableOpacity } from './TouchableOpacity/common';
export type { TouchableOpacityProps } from './TouchableOpacity/common';

export { default as Input } from './Input/common';
export type { InputProps } from './Input/common';

export { default as Card } from './Card/common';
export type { CardProps } from './Card/common';

export { default as Divider } from './Divider/common';
export type { DividerProps } from './Divider/common';

export { default as Icon, IconMap } from './Icon/common';
export type { IconProps, IconName } from './Icon/common';

// 重新导出核心功能
export * from '@cross-platform/core';