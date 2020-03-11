import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { UserContext } from './index';

export default (api: PluginAPI<UserContext>): void => {
  api.registerCommand(
    {
      command: 'hello <use-name>',
      description: '小任务系列一，hello username',
      options: [],
    },
    async (args, ctx) => {
      const [userName] = args;
      console.log(userName);
    },
  );
};
