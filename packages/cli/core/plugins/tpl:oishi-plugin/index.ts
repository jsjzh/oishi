import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { ensureFile, writeFile } from 'fs-extra';
import template from './template';
import path from 'path';

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'tpl:oishi-plg <command>',
      description: '快速创建 oishi-plugin 代码模板',
      options: [['-d, --hasDir', '是否要使用 {command}/index.ts 模式']],
    },
    async (args, ctx) => {
      const [command] = args;
      const { root, argv, helper, logger } = ctx;
      const { hasDir } = argv;

      const pluginName = hasDir
        ? path.join(`oishi-plugin-${command}`, 'index.ts')
        : `oishi-plugin-${command}.ts`;

      const pluginPath = path.resolve(root, pluginName);
      let _template = '';
      helper
        .createTaskList({ hasTip: true })
        .add({
          title: '解析传入数据，修改模板信息',
          task: async () => {
            _template = template
              .replace(/\<\% command \%\>/g, command)
              .replace(/\<\% description \%\>/g, '新建 plugin 待补充内容');
          },
        })
        .add({
          title: '装载 plugin，写入 plugin',
          task: async () => {
            await ensureFile(pluginPath);
            await writeFile(pluginPath, _template);
          },
        })
        .add({
          title: '',
          task: async () => {
            logger.successBg(
              `${pluginName} 工程完毕，现只需要在 CliCore 的实例中，添加 plugin 即可使用，使用方式为 \`<package.json 中的 bin 属性> ${command} hello-wrold\``,
            );
          },
        })
        .run();
    },
  );
};
