import json, { RollupJsonOptions as jsonOptions } from '@rollup/plugin-json';
import resolve, {
  Options as resolveOptions,
} from '@rollup/plugin-node-resolve';
import commonjs, {
  RollupCommonJSOptions as commonjsOptions,
} from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { MinifyOptions } from 'terser';

import builtins from 'builtin-modules';
const progress = require('rollup-plugin-progress');
const filesize = require('rollup-plugin-filesize');

import T from '../../types';

export interface ILibOptions {
  pkg: Partial<T.IBasePkg> & Record<keyof any, any>;
  json: jsonOptions;
  resolve: resolveOptions;
  terser: Omit<MinifyOptions, 'sourceMap'>;
  commonjs: commonjsOptions;
}

export default (options: ILibOptions) => {
  const {
    pkg,
    json: _json = {},
    resolve: _resolve = {},
    terser: _terser = {},
    commonjs: _commonjs = { include: '/node_modules/' },
  } = options;

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
      format: 'umd',
    },
    external: Object.keys(dependencies).concat(builtins),
    plugins: [
      json(_json),
      resolve(_resolve),
      terser(_terser),
      progress(),
      filesize(),
      commonjs(_commonjs),
    ],
  });
};
