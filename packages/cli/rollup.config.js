import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { builtinModules } from 'module';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
      banner: '#!/usr/bin/env node',
    }
  ],
  plugins: [
    resolve({
      extensions: ['.ts', '.js'],
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: !isProd
    }),
    isProd && terser()
  ],
  external: [
    ...builtinModules,
    'commander',
    'chalk',
    'inquirer',
    'fs-extra',
    'ora'
  ]
};
