import {
  name,
  version,
  dependencies,
  author,
  description,
  homepage,
} from './package.json';

import builtins from 'builtin-modules';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import progress from 'rollup-plugin-progress';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const banner = `
/* @preserve
 * ${name}@${version}
 * desc: ${description}
 * author: ${author}
 * home: ${homepage}
 * update: ${new Date()}
 */
`;

export default {
  input: './src/index.js',
  output: {
    file: 'lib/index.js',
    name,
    banner,
    format: 'cjs',
  },
  external: Object.keys(dependencies).concat(builtins),
  plugins: [
    json(),
    resolve(),
    terser(),
    progress(),
    filesize(),
    commonjs({ include: '/node_modules/' }),
  ],
};
