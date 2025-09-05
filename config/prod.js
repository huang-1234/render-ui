module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {
    optimizeMainPackage: {
      enable: true
    },
    minifyXML: {
      collapseWhitespace: true
    },
    webpackChain(chain) {
      chain.optimization.minimize(true);
      chain.plugin('terser').use(require('terser-webpack-plugin'), [
        {
          terserOptions: {
            compress: true,
            keep_classnames: false,
            keep_fnames: false,
            output: {
              comments: false
            }
          }
        }
      ]);
    }
  },
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  },
  rn: {}
};
