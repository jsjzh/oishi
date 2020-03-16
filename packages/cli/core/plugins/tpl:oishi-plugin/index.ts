import { PluginAPI } from '@oishi/cli-core/typings/plugin';

export default (api: PluginAPI<{}>): void => {
  api.registerCommand(
    {
      command: 'tpl:oishi-plugin <name>',
      description: '快速创建 oishi-plugin 代码模板',
      options: [
        ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
      ],
    },
    async (args, ctx) => {
      const [name] = args;
      const { helper, argv } = ctx;
    },
  );
};
