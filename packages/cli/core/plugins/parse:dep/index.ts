import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import {
  deepParseNpmLock,
  IDependencies,
  deepParseYarnLock,
} from '../../shared';
import path from 'path';
import { pathExists, readJson, readFile } from 'fs-extra';
import { ensureCli } from '@oishi/cli-shared';

const yarnLockFile = require('@yarnpkg/lockfile');

interface INpmLockJson {
  name: string;
  version: string;
  lockfileVersion: number;
  requires: boolean;
  dependencies: IDependencies;
}

interface IYarnLockJson {
  type: string;
  object: IDependencies;
}

interface IConfig {
  lockPath: string;
  lockJson: INpmLockJson | IYarnLockJson;
  dependenciesArr: {
    artifactId: string;
    version: string;
  }[];
}

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'parse:dep',
      description: '解析并输出项目依赖',
      options: [],
    },
    async (args, ctx) => {
      const { logger, root, helper, argv } = ctx;

      const globalRequireCli = ['git', 'npm'];

      if (!(await ensureCli(globalRequireCli)))
        throw helper.createError(
          `本脚本需要全局安装 ${globalRequireCli.join(',')} 依赖`,
        );

      const npmLockPath = path.join(root, 'package-lock.json');
      const yarnLockPath = path.join(root, 'yarn.lock');

      const [hasNpmLock, hasYarnLock] = await Promise.all([
        pathExists(npmLockPath),
        pathExists(yarnLockPath),
      ]);

      let currLockPath = '';

      if (hasNpmLock && hasYarnLock) {
        throw helper.createError(
          '检测到项目中有 package-lock.json yarn.lock 两个锁定依赖文件，请先移除一份（建议移除 yarn.lock）',
        );
      } else if (!hasNpmLock && !hasYarnLock) {
        throw helper.createError(
          '项目中没有找到 package-lock.json yarn.lock 任一锁定依赖版本文件，请先安装依赖',
        );
      } else if (!hasNpmLock && hasYarnLock) {
        currLockPath = yarnLockPath;
      } else if (hasNpmLock && !hasYarnLock) {
        currLockPath = npmLockPath;
      }

      const config = ({
        lockPath: currLockPath,
        lockJson: {},
        dependenciesArr: [],
      } as unknown) as IConfig;

      if (hasYarnLock) {
        const yarnLockFileContent = await readFile(currLockPath, {
          encoding: 'utf-8',
        });
        config.lockJson = yarnLockFile.parse(yarnLockFileContent);
      }

      if (hasNpmLock) {
        config.lockJson = await readJson(config.lockPath);
      }

      helper
        .createTaskList({ hasTip: true })
        .add({
          title: '递归获取项目实际所有依赖',
          task: async () => {
            const result = hasNpmLock
              ? deepParseNpmLock(
                  (config.lockJson as INpmLockJson).dependencies,
                  {},
                )
              : deepParseYarnLock(
                  (config.lockJson as IYarnLockJson).object,
                  {},
                );

            logger.info(JSON.stringify(result));
          },
        })
        .run();
    },
  );
};
