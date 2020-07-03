import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import builtins from 'builtin-modules';
const progress = require('rollup-plugin-progress');
const filesize = require('rollup-plugin-filesize');

import T from '../../types';

export interface ICliOptions {
  pkg: Partial<T.IBasePkg> & Record<keyof any, any>;
}

export default (options: ICliOptions) => {
  const { pkg } = options;

  const {
    name = 'unknown',
    version = 'unknown',
    dependencies = {},
    author = 'unknown',
    description = 'unknown',
    homepage = 'unknown',
  } = pkg;

  const banner = `
/* @preserve
 * ${name}@${version}
 * desc: ${description}
 * author: ${author}
 * home: ${homepage}
 * update: ${new Date()}
 */
`;

  return async () => ({
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
  });
};
