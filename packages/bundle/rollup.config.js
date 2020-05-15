import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';

import builtins from 'builtin-modules';

import pkg from './package.json';

const libRollupConfig = (options) => {
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
      name: name,
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

export default libRollupConfig({ pkg });
