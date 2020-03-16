import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import path from 'path';
import { ensureFile, existsSync } from 'fs-extra';
import log from '../shared/log';
import execa from 'execa';
import { curryProjectConcatPath } from '../shared';

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'bundle',
      description: 'rn 打包项目用命令脚本，需要帮助可以使用指令 -h',
      options: [
        [
          '-p, --platform <platform>',
          '设定打包平台：可选 ios 和 android',
          'ios',
        ],

        [
          '-e, --entry <filePath>',
          '设定打包入口文件路径，默认为 index.{platform}.js',
        ],
        [
          '-o, --output <filePath>',
          '设定输出文件路径，默认为 dist/index.{platform}.bundle',
        ],
        [
          '-s, --sourcemap <filePath>',
          '设定输出 sourcemap 路径，默认为 dist/index.{platform}.bundle.map',
        ],
        ['-c, --config <filePath>', '设定打包脚本路径', 'metro.config.js'],

        ['-d, --dev <boolean>', '设定为：打包 dev 环境', false],
        ['-m, --minify <boolean>', '设定为：压缩代码', true],
        ['-r, --reset-cache <boolean>', '设定为：不使用缓存', true],
      ],
    },
    async (args, ctx) => {
      const { argv } = ctx;
      const {
        platform,

        entry,
        output,
        sourcemap,
        config,

        dev,
        minify,
        resetCache,
      } = argv;

      // platform 检测
      if (platform !== 'ios' && platform !== 'android')
        throw new Error('platform 设置错误，只能为 ios 或者 android');

      const projectPath = process.cwd();

      const curryProjectPath = curryProjectConcatPath(projectPath);

      const reactNativeCliPath = curryProjectPath(
        './node_modules/react-native/local-cli/cli.js',
      );
      if (!existsSync(reactNativeCliPath))
        throw new Error(
          `${reactNativeCliPath} react-native-cli 路径无效，请确保你的项目存在 node_modules`,
        );

      const absEntryPath = entry
        ? curryProjectPath(entry)
        : curryProjectPath(`index.${platform}.js`);
      if (!existsSync(absEntryPath))
        throw new Error(`${absEntryPath} entry 路径无效`);

      const absOutputPath = output
        ? curryProjectPath(output)
        : curryProjectPath(path.join('dist', `index.${platform}.bundle`));

      const absSourcemapPath = sourcemap
        ? curryProjectPath(sourcemap)
        : curryProjectPath(path.join('dist', `index.${platform}.bundle.map`));

      const absConfigPath = config
        ? curryProjectPath(config)
        : curryProjectPath('metro.config.js');

      if (!existsSync(absConfigPath))
        throw new Error(`${absConfigPath} config 路径无效`);

      await Promise.all([
        ensureFile(absOutputPath),
        ensureFile(absSourcemapPath),
      ]);

      const realConfigsObj = {
        '--platform': platform,
        '--entry-file': absEntryPath,
        '--bundle-output': absOutputPath,
        '--sourcemap-output': absSourcemapPath,
        '--config': absConfigPath,
        '--dev': dev,
        '--minify': minify,
        '--reset-cache': resetCache,
      };

      const realConfigsArr: any = Object.keys(realConfigsObj).reduce(
        (pre: string[], curr: any) =>
          pre.concat([curr, (realConfigsObj as any)[curr]]),
        ['bundle'],
      );

      log.infoBg('开始打包项目');
      log.info(`打包平台：${realConfigsObj['--platform']}`);
      log.info(`打包入口文件：${realConfigsObj['--entry-file']}`);
      log.info(`打包输出文件：${realConfigsObj['--bundle-output']}`);
      log.info(`打包输出 map：${realConfigsObj['--sourcemap-output']}`);
      log.info(`打包脚本路径：${realConfigsObj['--config']}`);
      log.info(`是否打包 dev 环境：${realConfigsObj['--dev']}`);
      log.info(`是否压缩代码：${realConfigsObj['--minify']}`);
      log.info(`是否清除缓存：${realConfigsObj['--reset-cache']}`);
      console.log();
      log.info(
        `打包命令执行：node ${reactNativeCliPath} ${realConfigsArr.join(' ')}`,
      );

      try {
        (async () => {
          const { stdout } = await execa.node(
            reactNativeCliPath,
            realConfigsArr,
          );
          log.successBg('项目打包成功');
          log.success(stdout);
        })();
      } catch (error) {
        log.errorBg('项目打包出错，请重试');
        throw new Error(error);
      }
    },
  );
};
