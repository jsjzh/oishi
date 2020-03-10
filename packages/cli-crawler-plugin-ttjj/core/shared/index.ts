import path from 'path';
import { curry } from 'ramda';
import moment, { Moment } from 'moment';

export const curryGetAbsolutePath = curry(
  (root: string, inputPath: string): string =>
    path.isAbsolute(inputPath) ? inputPath : path.resolve(root, inputPath),
);

export const curryTimePath = curry(
  ((now: Moment) => (basePath: string, filePath: string) =>
    path.join(
      basePath,
      `${now.format('YYYY')} 年`,
      `${now.format('MM')} 月`,
      `${now.format('DD')} 日`,
      filePath,
    ))(moment()),
);

export const sleep = (second: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });

export const getCodePath = (basePath: string, code: string, name: string) =>
  path.join(basePath, `${code} - ${name}.json`);
