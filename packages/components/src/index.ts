// 基础组件
export { default as View } from './View';
export type { ViewProps } from './View';

export { default as Text, Heading1, Heading2, Heading3, Heading4, Paragraph, Caption, Link } from './Text';
export type { TextProps } from './Text';

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as SafeArea, useSafeAreaInsets } from './SafeArea';
export type { SafeAreaProps } from './SafeArea';

// 重新导出核心功能
export * from '@cross-platform/core';