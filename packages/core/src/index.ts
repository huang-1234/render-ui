// 运行时相关
export * from './runtime';
export * from './context';
export * from './router';
export * from './styles';

// 重新导出常用类型和函数
export type {
  Platform,
  Runtime,
  NavigateOptions,
  SystemInfo,
  RequestOptions,
} from './runtime';
// export {

//   RouteConfig,
//   RouteInfo,
//   StyleObject,
//   ThemeVariables
// } from './runtime';

// 默认导出
export { getCurrentRuntime as default } from './runtime';