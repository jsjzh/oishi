import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { getGitConfig } from '@oishi/cli-shared';
import { Files } from '@oishi/oishi-shared';
import path from 'path';
import validateNpmPackageName from 'validate-npm-package-name';
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import T from '../../types';
import execa from 'execa';

interface IConfig {
  projectPath: string;
  templatePath: string;
  name: string;
  version: string;
  description: string;
  author: string;
  tmpDirPath: string;
}

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'create:cli <name>',
      description: 'Quickly create cli templates',
      options: [
        [
          '-d, --description <string>',
          'Please enter a description of the project',
          'Project description to be added',
        ],
        [
          '-v, --version <string>',
          'Please enter the version number of the project',
          '0.0.0',
        ],
        [
          '--skip-tip',
          'Do you need to be prompted during the project creation process?',
        ],
        [
          '--skip-install',
          'Do you want to adjust the installation dependency process after creating the project?',
        ],
      ],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, root, helper, logger, cliRoot, npmRegistry } = ctx;
      const { description, version, skipTip, skipInstall } = argv;

      const conf: IConfig = {
        projectPath: path.join(root, name),
        templatePath: path.join(cliRoot, '/templates/create:cli'),
        name,
        version,
        description,
        author: '',
        tmpDirPath: '',
      };

      helper
        .createTaskList({ hasTip: !skipTip })
        .add({
          title: 'get project info ...',
          task: async () => {
            const [userName = '', userEmail = ''] = await Promise.all([
              getGitConfig('user.name', root),
              getGitConfig('user.email', root),
            ]);
            conf.author = `${userName} <${userEmail}>`;
          },
        })
        .add({
          title: 'check project name',
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
          },
        })
        .add({
          title: 'modify project info',
          task: async () => {
            const { path: tmpPath } = await tmp.dir();
            conf.tmpDirPath = path.join(tmpPath, name);
            await fs.copy(conf.templatePath, conf.tmpDirPath);
            const tmpPkg = path.join(conf.tmpDirPath, 'package.json');
            const pkgStr = (await fs.readFile(tmpPkg)).toString('utf-8');

            interface Replacer extends T.DynamicObject {
              name: string;
              version: string;
              description: string;
              author: string;
            }

            const obj: Replacer = {
              name: conf.name,
              version: conf.version,
              description: conf.description,
              author: conf.author,
            };

            await fs.writeFile(
              tmpPkg,
              pkgStr.replace(/<% (.+?) %>/g, (search, sub: string) =>
                obj[sub] ? obj[sub] : `unknown ${sub}`,
              ),
            );
          },
        })
        .add({
          title: 'create your project',
          task: async () => {
            await fs.copy(conf.tmpDirPath, conf.projectPath);

            (await new Files(conf.projectPath).getAllFiles()).forEach((file) =>
              logger._log(`create success ${file}`),
            );
          },
        })

        .add({
          title: 'install deps',
          task: async () => {
            if (skipInstall) {
              logger.info(
                `发现 skipInstall 参数为 truthy，不安装依赖，请在之后手动安装`,
              );
            } else {
              await execa('npm', ['install', `--registry=${npmRegistry}`], {
                cwd: conf.projectPath,
                stdio: 'inherit',
              });
            }
          },
        })

        .add({
          title: '',
          task: async () => {
            tmp.setGracefulCleanup();
            logger.success(`🚀 cd ${conf.name}`);
            if (skipInstall) logger.success(`🚀 npm install`);
            logger.success(`🚀 npm run test`);
          },
        })
        .run();
    },
  );
};
