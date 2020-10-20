import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import T from '../../types';
import fs from 'fs-extra';
import path from 'path';

import { createInput, createSelect, toFixedToNumber } from './helper';

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'sotck',
      description: '「震荡市方案」网格交易策略',
      options: [],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, cliRoot, root, helper, logger } = ctx;
      // const { word, age } = argv;

      helper
        // helper 创建任务链函数
        .createTaskList({ hasTip: true })
        .add({
          title: '输入当前成交价，自动计算网格上下成交价',
          task: async () => {
            let { price, rate } = await createInput();

            while (true) {
              const downPrice = toFixedToNumber(price * (1 - rate / 100));
              const upPrice = toFixedToNumber(price * (1 + rate / 100));

              const { selectPrice } = await createSelect(downPrice, upPrice);

              price = selectPrice;
            }
          },
        })
        .run();
    },
  );
};
