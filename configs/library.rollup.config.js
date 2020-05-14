import builtins from 'builtin-modules';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import progress from 'rollup-plugin-progress';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

export default (options) => {
  const { pkg } = options;

  const { name, version, dependencies, author, description, homepage } = pkg;

  const banner = `
/* @preserve
 * ${name || 'unknown'}@${version || 'unknown'}
 * desc: ${description || 'unknown'}
 * author: ${author || 'unknown'}
 * home: ${homepage || 'unknown'}
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
