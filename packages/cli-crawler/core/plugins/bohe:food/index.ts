import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import T from '../../types';

import {
  getFoodDetail,
  searchFood,
  getFoodList,
  IGetFoodList,
  IGetFoodListResp,
} from '../../service/food';

import { RandomPromise } from '../../shared';
import fs from 'fs-extra';
import path from 'path';

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'bohe:food',
      description: '爬取薄荷 app 食物信息',
      options: [],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, cliRoot, root, helper, logger } = ctx;

      // const { word, age } = argv;

      // const globalConfig = {
      //   currentPage
      // } as any;

      helper
        // helper 创建任务链函数
        .createTaskList({ hasTip: true })
        .add({
          title: '开始爬取数据',
          task: async () => {
            const deal = new RandomPromise<IGetFoodList, IGetFoodListResp>(
              getFoodList,
              {
                value: 1,
                page: 0,
                kind: 'group',
              },
              {
                async handleWhile(data, resp: any) {
                  data.page++;

                  if (resp) {
                    if (Number(resp.total_pages) >= Number(data.page)) {
                      return true;
                    } else {
                      if (data.value < 7) {
                        data.page = 1;
                        data.value++;
                        return true;
                      } else {
                        return false;
                      }
                    }
                  } else {
                    return true;
                  }
                },
                async handleResp(resp, data) {
                  const fileWay = `${data.kind}/${data.value}/${data.page}`;
                  const filePath = path.resolve(root, `./data/${fileWay}.json`);

                  logger.info(`获取 ${fileWay} 数据成功，正在写入 ${filePath}`);

                  await fs.ensureFile(filePath);
                  await fs.writeJSON(filePath, resp);
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
