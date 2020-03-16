import { PluginAPI } from '@oishi/cli-core/typings/plugin';

interface UserData {
  userName: string;
  userEmail: string;
}

export default (api: PluginAPI<UserData>): void => {
  api.registerCommand(
    {
      command: '<% command %> <command>',
      description: '<% command %> 自动生成的 plugin 模版',
      options: [
        [
          '-d, --description <string>',
          '<% description %>',
          'plugin 描述，待补充',
        ],
      ],
    },
    async (args, ctx) => {
      // 从 command 中获取的数据
      const [command] = args;
      // 从 options 中获取的数据
      const { argv } = ctx;
      const { description } = argv;
      // 用户自定义的数据，在创建 CliCore 的时候，通过 context 传入
      const { userName, userEmail } = ctx;
      // 帮助函数链
      const { helper, logger } = ctx;
      // 帮助函数 - 创建任务链函数
      helper
        .createTaskList({ hasTip: true })
        .add({
          title: '获取 command 信息',
          task: async () => {
            logger.infoBgTip('command', command);
          },
        })
        .add({
          title: '获取 options 信息',
          task: async () => {
            // 由于没有在 new CliCore 的时候传入 userName
            // 这里会获取到 undefined
            logger.infoBgTip('options userName', userName);
            logger.infoBgTip('options userEmail', userEmail);
          },
        })
        .run();
    },
  );
};
