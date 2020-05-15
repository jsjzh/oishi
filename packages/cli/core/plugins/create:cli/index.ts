import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import execa from 'execa';
import path from 'path';
import { writeJSON, ensureFile, writeFile, ensureDir } from 'fs-extra';
import templatesJson from './template';
import { IContent } from '../../index';

export default (api: PluginAPI<IContent>): void => {
  api.registerCommand(
    {
      command: 'create:cli <name> <command>',
      description: '快速创建 cli 代码模板',
      options: [],
    },
    async (args, ctx) => {
      const [name, command] = args;
      const { root, helper, logger } = ctx;
      const projectPath = path.join(root, name);
      const pkgPath = path.join(projectPath, 'package.json');
      const binPath = `bin/${name}.js`;

      helper
        .createTaskList({ hasTip: true })
        .add({
          title: '',
          task: async () => {
            await execa('oishi', ['create:ts', name, '--tip'], {
              cwd: root,
              stdio: 'inherit',
            });
          },
        })
        .add({
          title: 'oishi create:cli 解析参数',
          task: async () => {
            const pkg = require(pkgPath);
            pkg.bin = { [name]: binPath };
            pkg.dependencies['@oishi/cli-core'] = '^0.0.33';
            await writeJSON(pkgPath, pkg, { spaces: 2 });
          },
        })
        .add({
          title: 'oishi create:cli 修改模板',
          task: async () => {
            templatesJson.forEach((item) => {
              if (item.type === 'bin')
                item.path = item.path.replace(/\<\% name \%\>/g, name);
              if (item.type === 'core')
                item.value = item.value.replace(/\<\% command \%\>/g, command);
            });

            await Promise.all(
              templatesJson.map(async (item) => {
                const fileCurrPath = path.join(projectPath, item.path);
                await ensureFile(fileCurrPath);
                await writeFile(fileCurrPath, item.value);
              }),
            );
          },
        })
        .add({
          title: '',
          task: async () => {
            const pluginsPath = path.join(projectPath, 'core', 'plugins');
            await ensureDir(pluginsPath);
            await execa('oishi', ['create:plg', command, '--dir', '--tip'], {
              cwd: pluginsPath,
              stdio: 'inherit',
            });
          },
        })
        .add({
          title: '安装依赖',
          task: async () => {
            await execa('yarn', ['install'], {
              cwd: projectPath,
              stdio: 'inherit',
            });
          },
        })
        .add({
          title: '',
          task: async () => {
            console.log();
            logger.success(`🚀 cd ${name}`);
            logger.success(`🚀 node ${binPath} ${command} baby`);
            logger.success(`🚀 node ${binPath} -h`);
            logger.success(`🚀 node ${binPath} ${command} -h`);
            console.log();
          },
        })
        .run();
    },
  );
};
