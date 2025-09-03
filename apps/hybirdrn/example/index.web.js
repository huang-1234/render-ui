import { AppRegistry } from 'react-native';
import App from './App';

// 注册应用
AppRegistry.registerComponent('Example', () => App);

// 在Web上运行
AppRegistry.runApplication('Example', {
  rootTag: document.getElementById('root'),
});
