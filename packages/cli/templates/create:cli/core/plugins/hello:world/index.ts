import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import T from '../../types';

import { ensureCli, getGitConfig } from '@oishi/cli-shared';
import { CreateAPI } from '@oishi/shared';

const service = new CreateAPI('http://www.weather.com.cn');

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'hello:world <name>',
      description: '基础 cli 指令',
      options: [
        ['-w, --word <string>', '说点什么', 'say anything'],
        ['--age <number>', 'age', 18],
      ],
    },
    async (args, ctx) => {
      // 从 command 中获取的数据
      const [name] = args;
      /**
       * word age 是从 options 获取来的数据
       * cliRoot 用户自定义的数据，在 new CliCore 时候，通过 context 传入的
       * root 项目根目录
       * helper helper 函数
       * logger logger 函数
       */
      const {
        argv: { word, age },
        cliRoot,
        root,
        helper,
        logger,
      } = ctx;

      helper
        // helper 创建任务链函数
        .createTaskList({ hasTip: true })
        .add({
          title: '获取 command 信息',
          task: async () => {
            logger._log(`command: ${name}`);
          },
        })
        .add({
          title: '获取 options 信息',
          task: async () => {
            logger._log(`options word: ${word}`);
            logger._log(`options age: ${age}`);
          },
        })
        .add({
          title: '获取 context 信息',
          task: async () => {
            logger._log(`context cliRoot: ${cliRoot}`);
          },
        })
        .add({
          title: '演示 @oishi/cli-shared ensureCli 函数',
          task: async () => {
            const clis = ['npm', 'yarn'];

            if (await ensureCli(clis)) {
              logger._log(`当前具有 ${clis.join(' ')} 环境`);
            }
          },
        })
        .add({
          title: '演示 @oishi/cli-shared getGitConfig 函数',
          task: async () => {
            const [userName, userEmail] = await Promise.all([
              getGitConfig('user.name', root),
              getGitConfig('user.email', root),
            ]);

            logger._log(`git.user.name: ${userName}`);
            logger._log(`git.user.email: ${userEmail}`);
          },
        })
        .add({
          title: '演示 @oishi/oishi-shared CreateAPI 函数',
          task: async () => {
            const poetry = await service.getJSON('/data/sk/101210101.html', {});
            try {
              logger._log(
                `${poetry.weatherinfo.city}现在吹的是${poetry.weatherinfo.WD}，ps: 我是调接口获取来的！`,
              );
            } catch (error) {
              logger._log(poetry);
              logger.error(
                '如果看到我的话，有可能是因为接口挂了，不过问题不大。',
              );
            }
          },
        })
        .run();
    },
  );
};
