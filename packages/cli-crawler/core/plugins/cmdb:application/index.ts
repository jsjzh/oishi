import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import T from '../../types';

import { IGetApplicationList, getApplicationList } from '../../service/cmdb';

import { RandomPromise } from '../../shared';
import fs from 'fs-extra';
import path from 'path';

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'cmdb:application',
      description: '爬取 cmdb 应用信息',
      options: [],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, cliRoot, root, helper, logger } = ctx;

      helper
        // helper 创建任务链函数
        .createTaskList({ hasTip: true })
        .add({
          title: '开始爬取数据',
          task: async () => {
            const deal = new RandomPromise<IGetApplicationList, any>(
              getApplicationList,
              { pageSize: 100, page: 0 },
              {
                async handleWhile(data, resp: any) {
                  data.page++;

                  // TODO 这里似乎有点问题，为什么一定要 if resp
                  if (resp) {
                    if (Number(resp.data.totalPage) >= Number(data.page)) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    return true;
                  }
                },
                async handleResp(resp, data) {
                  const fileWay = `application/page - ${data.page}`;
                  const filePath = path.resolve(
                    root,
                    `./data/cmdb/${fileWay}.json`,
                  );

                  logger.info(`获取 ${fileWay} 数据成功，正在写入 ${filePath}`);

                  await fs.ensureFile(filePath);
                  await fs.writeJSON(filePath, resp.data.items);
                },
              },
            );

            await deal.excute();
          },
        })
        .run();
    },
  );
};
