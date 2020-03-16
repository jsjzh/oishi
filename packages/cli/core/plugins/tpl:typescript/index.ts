import path from 'path';
import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import Helper from './shared/helper';
import NpmManager from './shared/npm';

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'tpl:ts <name>',
      description: '快速创建 typescript 代码模板',
      options: [
        ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
        ['-v, --version <string>', '项目版本', '0.0.0'],
      ],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, root } = ctx;
      const { description, version } = argv;

      const helper = new Helper(ctx);

      const warn = helper.validatePkgName(name);
      if (warn) throw new Error(warn);

      const userName = await helper.getGitConfig('user.name');
      const userEmail = await helper.getGitConfig('user.email');
      const author = `${userName} ${userEmail}`;

      await helper.copyTempToCwd(path.resolve(__dirname, './template'));

      const npmManager = new NpmManager(path.resolve(root, './package.json'));

      npmManager
        .setProps('author', author)
        .setProps('name', name)
        .setProps('description', description)
        .setProps('version', version)
        .rewrite();
    },
  );
};
