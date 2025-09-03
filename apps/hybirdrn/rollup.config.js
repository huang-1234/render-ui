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
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(), // 将 peerDependencies 外部化
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      // 为 Web 构建时，将 react-native 替换为 react-native-web
      preferBuiltins: false,
      browser: true,
      dedupe: ['react-native', 'react', 'react-dom']
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
  external: ['react-native', 'react-native-web'] // 确保这些库不被捆绑
};
