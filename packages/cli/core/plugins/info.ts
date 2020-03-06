import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import envinfo from 'envinfo';

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'info',
      description: 'print information about your environment',
      options: [],
    },
    async (args, ctx) => {
      const { helper } = ctx;
      helper
        .createTaskList({ hasTip: true })
        .add({
          title: 'print information about your environment',
          task: async () => {
            envinfo
              .run(
                {},
                {
                  showNotFound: true,
                  duplicates: true,
                  fullTree: true,
                },
              )
              .then(console.log);
          },
        })
        .run();
    },
  );
};
