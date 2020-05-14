import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import execa from 'execa';
import path from 'path';
import { writeJSON, ensureFile, writeFile, ensureDir } from 'fs-extra';

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'bundle:lib <input> <output>',
      description: '使用 rollup 打可作为第三方类库的包',
      options: [],
    },
    async (args, ctx) => {
      const [input, output] = args;
      const { root, helper, logger } = ctx;
      // helper.createTaskList({ hasTip: true }).run();
    },
  );
};
