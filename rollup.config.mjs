'use strict';

import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [
  resolve(),
  eslint(),
  babel(),
  terser()
];

const paths = [
  'co2.js'
];

const addBundle = (filename) => ({
  input: `src/${filename}`,
  plugins: plugins,
  output: {
    file: `dist/${filename}`,
    format: 'iife',
    sourcemap: true
  }
});

const config = paths.map((filename) => addBundle(filename));
export default config;
