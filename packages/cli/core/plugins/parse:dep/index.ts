import T from '../../types';
import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { ensureCli } from '@oishi/cli-shared';
import { ParseDep } from '@oishi/node-shared';

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'parse:dep',
      description: '解析并输出项目依赖',
      options: [],
    },
    async (args, ctx) => {
      const { logger, root, helper, argv } = ctx;

      const globalRequireCli = ['npm'];

      if (!(await ensureCli(globalRequireCli)))
        throw helper.createError(
          `本脚本需要全局安装 ${globalRequireCli.join(',')} 依赖`,
        );

      helper
        .createTaskList({ hasTip: true })
        .add({
          title: '递归获取项目实际所有依赖',
          task: async () => {
            const parseDep = new ParseDep(root);
            const result = parseDep.output();

            // let depCount = 0;
            // let repCount = 0;
            // let repDeps: string[] = [];

            // Object.keys(result).forEach((key) => {
            //   depCount = depCount + 1;
            //   const item = result[key];
            //   if (item.versions.length !== 1) {
            //     repCount = repCount + 1;
            //     repDeps.push(key);
            //   }
            // });

            logger.info(JSON.stringify(result));
            // logger.space();
            // logger.info(`项目依赖共有：${depCount} 个`);
            // logger.space();
            // logger.info(`同一依赖，但有多个版本：${repCount} 个`);
            // logger.space();
            // if (repCount && repDeps.length) {
            //   logger.info(`具有多个版本的依赖：${JSON.stringify(repDeps)}`);
            // }
          },
        })
        .run();
    },
  );
};
