// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  plugins: [
    // 支持装饰器语法
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    // 支持类属性语法
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    // 支持可选链操作符
    "@babel/plugin-proposal-optional-chaining",
    // 支持空值合并操作符
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
};
