import path from 'path';
import execa from 'execa';
import validateNpmPackageName from 'validate-npm-package-name';
import { ensureDir, writeFile, ensureFile } from 'fs-extra';
import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import templateJson from './template';
interface IConfig {
  root: string;
  name: string;
  description: string;
  version: string;
  userName?: string;
  userEmail?: string;
}

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
      const { argv, root, helper, logger } = ctx;
      const { description, version } = argv;
      const conf: IConfig = {
        root: path.join(root, name),
        name,
        description,
        version,
      };

      helper
        .createTaskList({ hasTip: true })
        .add({
          title: '验证 name 是否符合规范',
          task: async () => {
            const {
              errors,
              validForNewPackages,
              warnings,
            } = validateNpmPackageName(conf.name);
            if (!validForNewPackages) {
              logger.error('name 错误');
              if (errors) throw new Error(errors.join(' '));
              if (warnings) throw new Error(warnings.join(' '));
            }
          },
        })
        .add({
          title: '创建项目目录',
          task: async () => {
            await ensureDir(conf.root);
          },
        })
        .add({
          title: '获取 git config 信息',
          task: async () => {
            const [userName, userEmail] = await Promise.all([
              getGitConfig('user.name', conf.root),
              getGitConfig('user.email', conf.root),
            ]);
            conf.userName = userName;
            conf.userEmail = userEmail;
          },
        })
        .add({
          title: '修改模板信息',
          task: async () => {
            templateJson.forEach(item => {
              if (item.path === 'package.json') {
                // "name": "<% name %>",
                // "version": "<% version %>",
                // "description": "<% description %>",
                // "author": "<% author %>",
                item.value = item.value
                  .replace('<% name %>', conf.name)
                  .replace('<% version %>', conf.version)
                  .replace('<% description %>', conf.description)
                  .replace(
                    '<% author %>',
                    `${conf.userName} <${conf.userEmail}>`,
                  );
              }
            });
          },
        })
        .add({
          title: '生成对应工程文件',
          task: async () => {
            const promises = templateJson.map(async item => {
              await ensureFile(path.resolve(conf.root, item.path));
              await writeFile(path.resolve(conf.root, item.path), item.value);
            });

            await Promise.all(promises);
          },
        })
        .run();
    },
  );
};

const getGitConfig = async (props: string, cwd: string): Promise<string> => {
  const { stdout } = await execa('git', ['config', '--get', props], { cwd });
  return stdout;
};
