import path from 'path';
import execa from 'execa';
import validateNpmPackageName from 'validate-npm-package-name';
import { ensureDir, writeFile, ensureFile } from 'fs-extra';
import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import templatesJson from './template';
import { IContent } from '../../index';
interface IConfig {
  projectPath: string;
  name: string;
  description: string;
  version: string;
  userName: string;
  userEmail: string;
}
export default (api: PluginAPI<IContent>): void => {
  api.registerCommand(
    {
      command: 'create:ts <name>',
      description: '快速创建 typescript 代码模板',
      options: [
        ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
        ['-v, --version <string>', '项目版本', '0.0.0'],
        ['--tip', '是否需要 tip 提示信息'],
      ],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, root, helper, logger } = ctx;
      const { description, version, tip } = argv;

      const conf: IConfig = {
        projectPath: path.join(root, name),
        name,
        description,
        version,
        userName: '',
        userEmail: '',
      };

      await ensureDir(conf.projectPath);

      helper
        .createTaskList({ hasTip: !!tip })
        .add({
          title: 'oishi create:ts 获取参数',
          task: async () => {
            const [userName, userEmail] = await Promise.all([
              getGitConfig('user.name', conf.projectPath),
              getGitConfig('user.email', conf.projectPath),
            ]);
            conf.userName = userName;
            conf.userEmail = userEmail;
          },
        })
        .add({
          title: 'oishi create:ts 验证参数',
          task: async () => {
            const {
              errors,
              validForNewPackages,
              warnings,
            } = validateNpmPackageName(conf.name);
            if (!validForNewPackages) {
              if (errors)
                throw new Error(`输入的 name 不合规：${errors.join(' ')}`);
              if (warnings)
                throw new Error(`输入的 name 不合规：${warnings.join(' ')}`);
            }
            if (!conf.userName) {
              logger.info('无法获取到 git user.name');
            }
            if (!conf.userEmail) {
              logger.info('无法获取到 git user.email');
            }
          },
        })
        .add({
          title: 'oishi create:ts 修改模板',
          task: async () => {
            templatesJson.forEach((item) => {
              if (item.type === 'package') {
                // 这里其实可以改成 replace(RegExp, callback) 类型的
                // 不过为了方便修改，还是先不这么搞
                item.value = item.value
                  .replace(/\<\% name \%\>/g, conf.name)
                  .replace(/\<\% version \%\>/g, conf.version)
                  .replace(/\<\% description \%\>/g, conf.description)
                  .replace(
                    /\<\% author \%\>/g,
                    `${conf.userName} <${conf.userEmail}>`,
                  );
              }
            });
          },
        })
        .add({
          title: 'oishi create:ts 生成项目',
          task: async () => {
            await Promise.all(
              templatesJson.map(async (item) => {
                const fileCurrPath = path.join(conf.projectPath, item.path);
                await ensureFile(fileCurrPath);
                await writeFile(fileCurrPath, item.value);
              }),
            );
          },
        })
        .add({
          title: '',
          task: async () => {
            console.log();
            logger.success(`🚀 cd ${conf.name}`);
            logger.success(`🚀 yarn`);
            logger.success(`🚀 node src/index.js`);
            console.log();
          },
        })
        .run();
    },
  );
};

const getGitConfig = async (props: string, cwd: string): Promise<string> => {
  const { stdout } = await execa('git', ['config', '--get', props], { cwd });
  return stdout ? stdout : '';
};
