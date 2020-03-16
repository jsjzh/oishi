import { curry } from 'ramda';
import path from 'path';

export const curryProjectConcatPath = curry(
  (projectPath: string, filePath: string) =>
    path.resolve(projectPath, filePath),
);
