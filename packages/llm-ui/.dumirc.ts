import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Lobe UI Agent',
  favicon: '/favicon.ico',
  logo: '/logo.png',
  outputPath: 'docs-dist',
  mode: 'site',
  hash: true,
  
  // 导航配置
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/lobehub/lobe-ui-agent',
    },
  ],

  // 更多配置
  resolve: {
    includes: ['docs', 'src'],
  },

  // 主题配置
  theme: {
    '@primary-color': '#1677ff',
  },

  // 插件
  plugins: ['@umijs/plugin-sass'],

  // 别名
  alias: {
    '@': '/src',
  },

  // 外部依赖
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  // 脚本
  scripts: [
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  ],

  // 样式
  styles: [
    `
      .dumi-default-header-left {
        width: auto !important;
      }
      .dumi-default-navbar {
        padding: 0 28px !important;
      }
      .dumi-default-sidebar {
        top: 64px !important;
      }
    `,
  ],
});