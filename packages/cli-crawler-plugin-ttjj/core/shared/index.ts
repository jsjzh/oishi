import path from 'path';
import { curry } from 'ramda';

export const getAbsolutePath = (root: string, inputPath: string): string =>
  path.isAbsolute(inputPath) ? inputPath : path.resolve(root, inputPath);

export const curryGetAbsolutePath = curry(getAbsolutePath);
