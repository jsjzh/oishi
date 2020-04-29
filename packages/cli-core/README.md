# `@oishi/cli-core`

联合开发

代码需要修改，如果和 lerna 一起用的话，create:cli 就应该创建在 packages 里面

#### 使用方式

```bash
npm install -S @oishi/cli-core
# yarn add @oishi/cli-core
```

创建脚本任务链的底层框架，接下来会用该框架写几个简单的小任务，以此来熟悉该工具，使用语言为 typescript

任务目标一：使用框架做指令分发，命令行输入 cli-hello hello jinzhehao 的时候，自动输出 hello jinzhehao

- 安装 bin
- 使用 plugin

## 使用方式

### 安装

新建一个项目，安装相关依赖

```cmd
mkdir cli-hello
cd cli-hello

npm init -y
npm install -D typescript
npm install -S @oishi/cli-core
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

## TODO

1. helper.createTaskList.add 增加一个执行条件，就是一个 async function，如果为 true 才会执行
2. 是否可以给 helper.createTaskList 增加一个默认的加载转圈圈
3. 如何做到每个 task 的返回会传递到下一个 task，这个又要复合 1 的调过条件，因为不同的 function 如果希望传递的话只能通过在前面设置 config
