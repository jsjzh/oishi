import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { Queue } from '@oishi/oishi-shared';
import {
  curryGetAbsolutePath,
  curryTimePath,
  sleep,
  getCodePath,
} from './shared';
import { readJSON, writeJSON, ensureDir, ensureFile } from 'fs-extra';
import path from 'path';
import { createService } from './service';

interface IAllCode {
  code: string;
  name: string;
}

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'ttjj',
      description: '爬取「天天基金」相关的数据',
      options: [
        [
          '-c, --config <path>',
          '爬虫所需 config 文件路径，绝对地址或者相对地址皆可',
          './oishi-crawler/ttjj/config.json',
        ],
        [
          '-o, --output <path>',
          '爬取到数据之后导出路径，绝对地址或者相对地址皆可',
          './oishi-crawler/ttjj/output',
        ],
      ],
    },
    async (args, ctx) => {
      const { root, helper, argv } = ctx;
      const { config, output } = argv;

      const curryGetRootAbsolutePath = curryGetAbsolutePath(root);
      const curryOutPathTimePath = curryTimePath(output);

      const GetMyAssetDetailsPath = curryOutPathTimePath(
        'GetMyAssetDetailsPath',
      );
      const GetShareDetailPath = curryOutPathTimePath('GetShareDetailPath');
      const GetTransactionRecordsPath = curryOutPathTimePath(
        'GetTransactionRecordsPath',
      );
      const GetProfitListPath = curryOutPathTimePath('GetProfitListPath');

      const initAndCheckPathPromises = [
        readJSON(curryGetRootAbsolutePath(config)),
      ].concat(
        [
          GetMyAssetDetailsPath,
          GetShareDetailPath,
          GetTransactionRecordsPath,
          GetProfitListPath,
        ].map((filePath: string) => ensureDir(filePath)),
      );

      const [configJson] = await Promise.all(initAndCheckPathPromises);

      const tradeapilvs5 = createService(
        'https://tradeapilvs5.1234567.com.cn/',
        { handleResp: data => data.Data },
        { UserId: configJson.UserId },
      );

      const rspData = await tradeapilvs5.GetMyAssetDetails(configJson);

      await writeJSON(path.join(GetMyAssetDetailsPath, 'data.json'), rspData, {
        spaces: 2,
      });

      const allCode: IAllCode[] = rspData.AssetDetails.map((item: any) => ({
        code: item.FundCode,
        name: item.FundName,
      }));

      const sharedDetailTasks = helper.createTaskList({ hasTip: true }).add(
        allCode.map(({ name, code }) => {
          const codePath = getCodePath(GetShareDetailPath, code, name);
          return {
            title: `爬取基金队列 ${code} ${name}`,
            task: async () => {
              const rspData = await tradeapilvs5.GetShareDetail({
                FundCode: code,
              });
              await Promise.all([
                ensureFile(codePath),
                writeJSON(codePath, rspData, { spaces: 2 }),
              ]);
              return sleep(3);
            },
          };
        }),
      );

      const transactionRecordsTasks = helper
        .createTaskList({ hasTip: true })
        .add(
          allCode.map(({ name, code }) => {
            const codePath = getCodePath(GetTransactionRecordsPath, code, name);
            return {
              title: `爬取操作记录 ${code} ${name}`,
              task: async () => {
                const rspData = await tradeapilvs5.GetTransactionRecords({
                  FundCode: code,
                });
                await Promise.all([
                  ensureFile(codePath),
                  writeJSON(codePath, rspData, { spaces: 2 }),
                ]);
                return sleep(3);
              },
            };
          }),
        );

      const profitListTasks = helper.createTaskList({ hasTip: true }).add(
        allCode.map(({ name, code }) => {
          const codePath = getCodePath(GetProfitListPath, code, name);
          return {
            title: `爬取基金队列 ${code} ${name}`,
            task: async () => {
              const rspData = await tradeapilvs5.GetProfitList({
                FundCode: code,
              });
              await Promise.all([
                ensureFile(codePath),
                writeJSON(codePath, rspData, { spaces: 2 }),
              ]);
              return sleep(3);
            },
          };
        }),
      );

      const queue = new Queue();

      queue
        .push(async (next: Function) => {
          await sharedDetailTasks.run();
          next();
        })
        .push(async (next: Function) => {
          await transactionRecordsTasks.run();
          next();
        })
        .push(async (next: Function) => {
          await profitListTasks.run();
          next();
        })
        .next();
    },
  );
};
