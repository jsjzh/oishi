import path from 'path';
import { curry } from 'ramda';
import moment, { Moment } from 'moment';
import { IAllCode } from '..';
import { ensureFile, writeJSON } from 'fs-extra';

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

export const createFundTasks = (
  title: string,
  codeLists: IAllCode[],
  savePath: string,
  request: <T = any>(data: { FundCode: string }) => Promise<T>,
): { title: string; task: () => Promise<any> }[] => {
  return codeLists.map(({ name, code }) => {
    const codePath = getCodePath(savePath, code, name);
    return {
      title: `${title} ${code} ${name}`,
      task: async () => {
        const rspData = await request({
          FundCode: code,
        });
        await Promise.all([
          ensureFile(codePath),
          writeJSON(codePath, rspData, { spaces: 2 }),
        ]);
        return sleep(3);
      },
    };
  });
};
