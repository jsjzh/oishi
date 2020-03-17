"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template = `import { PluginAPI } from '@oishi/cli-core/typings/plugin';

interface UserData {
  userName: string;
  userEmail: string;
  userGit: string;
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
      const { userName, userEmail, userGit } = ctx;
      // 帮助函数集
      const { helper, logger } = ctx;
      // 帮助函数 - 创建任务链函数
      helper
        .createTaskList({ hasTip: false })
        .add({
          title: '获取 command 信息',
          task: async () => {
            logger.info(\`command: \${command}\`);
          },
        })
        .add({
          title: '获取 options 信息',
          task: async () => {
            // 输出在 new CliCore 中传入的 context
            logger.info(\`options userName: \${userName}\`);
            logger.info(\`options userEmail: \${userEmail}\`);
            logger.info(\`options userGit: \${userGit}\`);
          },
        })
        .run();
    },
  );
};
`;
exports.default = template;
