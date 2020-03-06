# `@oishi/cli-core`

创建脚本任务链的底层框架

## 使用方式

### 安装

```cmd
yarn add @oishi/cli-core
```

### 使用

#### `core/index.ts`

```ts
import CliCore from '@oishi/cli-core';
import path from 'path';

export interface UserContext {
  baseUrl: string;
}

const cli = new CliCore({
  root: process.cwd(),
  pkg: require('../package.json'),
  context: { baseUrl: 'http://www.xxx.xxx' },
  plugins: [path.resolve(__dirname, './create')],
});

cli.execute();
```

#### `core/create.ts`

```ts
import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import { UserContext } from './index';

export default (api: PluginAPI<UserContext>): void => {
  api.registerCommand(
    {
      command: 'create <app-name> [app-target]',
      description: 'create a app',
      options: [
        ['-g, --git <git>', "template's git url", 'https://github.com/xx/xxx'],
        [
          '-r, --registry <registry>',
          'set npm registry',
          'https://registry.npm.taobao.org/',
        ],
      ],
    },
    async (args, ctx) => {
      const [appName, appTaget] = args;
      const { helper, baseUrl, argv } = ctx;
      helper
        .createTaskList({ hasTip: true })
        .add({
          title: 'get cmd entry appName',
          task: async () => {
            console.log('appName: ' + appName);
          },
        })
        .add({
          title: 'get cmd entry appTaget',
          task: async () => {
            console.log('appTaget: ' + appTaget);
          },
        })
        .add({
          title: 'get interface UserContext["baseUrl"]',
          task: async () => {
            console.log('baseUrl: ' + baseUrl);
          },
        })
        .add({
          title: 'get cmd options',
          task: async () => {
            console.log('argv.git: ' + argv.git);
            console.log('argv.registry: ' + argv.registry);
          },
        })
        .run();
    },
  );
};
```
