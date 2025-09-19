// 组件
export * from './components';

// 钩子
export * from './hooks';

// 状态管理
export { useChatStore } from './store/chatStore';
export { useThemeStore } from './store/themeStore';
export { useToolStore } from './store/toolStore';

// 主题
export * from './themes';

// 工具
export * from './tools';

// 类型
export * from './types/chat';
export * from './types/tool';
export * from './types/theme';

// 工具函数
export * from './utils/helpers';
export { StreamProcessorOptions } from './utils/streamProcessor';
export { errorHandler, ErrorCode, withRetry } from './utils/errorHandler';

// 版本信息
export const version = '1.0.0';