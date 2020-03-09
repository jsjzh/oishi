import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { curryGetAbsolutePath } from './shared';
import { readJSON, ensureDir } from 'fs-extra';

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
      let { config, output } = argv;

      const curryGetRootAbsolutePath = curryGetAbsolutePath(root);

      const [configJson] = await Promise.all([
        readJSON(curryGetRootAbsolutePath(config)),
        ensureDir(curryGetRootAbsolutePath(output)),
      ]);

      helper.createTaskList({ hasTip: true }).add({
        title: '获取所有持仓基金',
        task: async () => {},
      });
    },
  );
};
