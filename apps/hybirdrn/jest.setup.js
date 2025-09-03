// 添加测试环境的全局设置
import '@testing-library/jest-native/extend-expect';

// 模拟 react-native 的 Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn(obj => obj.web || obj.default || {}),
}));

// 模拟 react-native 的 Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// 全局变量
global.window = {};
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();
