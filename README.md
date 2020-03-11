# oishi

> oishi 是日语「好好次」的发音，日语写作「おいしい」

## 项目介绍

oishi 项目集，包括了很多工具和命令行，下面会逐一介绍

### `@oishi/cli`

#### 使用方式

```cmd
npm install -g @oishi/cli
# yarn global add @oishi/cli
```

```cmd
oishi -h
oishi info
```

#### 介绍

占位库，暂时没想好用来做什么，只有一个简单的指令，后续如果继续赋能的话会在这里补充

### `@oishi/cli-core`

#### 使用方式

```cmd
npm install -S @oishi/cli-core
# yarn add @oishi/cli-core
```

#### 介绍

重点介绍对象，该库为最基础的底层框架，因为有点长，就不在首页写了，使用的方式可以参考如下

[@oishi/cli-core](./packages/cli-core/README.md)

### `@oishi/cli-crawler`

#### 使用方式

```cmd
npm install -g @oishi/cli-crawler
# yarn global add @oishi/cli-crawler
```

```cmd
oishi-crawler -h

oishi-crawler ttjj
oishi-crawler ttjj --config <path>
oishi-crawler ttjj --output <path>
oishi-crawler ttjj --config <path> --output <path>
```

#### 介绍

作为爬虫的底层脚本包装框架，所有的爬虫可以通过 `plugins: ['@oishi/cli-crawler-plugin-ttjj']` 的方式来自动引入

在使用该脚本命令时，需要一个 config.json，具体的数据根据 charles 可以爬到，config.json 的格式如下

```ts
interface IConfig {
  CToken: string;
  MobileKey: string;
  ServerVersion: string;
  UToken: string;
  UserId: string;
}
```

### `@oishi/cli-crawler-plugin-ttjj`

#### 使用方式

作为 `@oishi/cli-crawler` 的 plugin 使用

### `@oishi/oishi-shared`

#### 使用方式

作为 `oishi` 的通用库，可作为普通的工具类库来使用

## node debug

### `javascript`

vscode 中调试和执行普通 js 文件方式，直接执行编译后的 js 代码，没有 sourcemap 映射到 ts

```json
{
    "type": "node",
    "request": "launch",
    "name": "TEST-Debug",
    "program": "${workspaceFolder}/test/index.js"
},
```

### `typescript`

#### `ts-node`

推荐使用 `ts-node` 直接执行和调试 ts 代码

```json
{
  "type": "node",
  "request": "launch",
  "name": "ts-debug",
  "cwd": "${workspaceFolder}/packages/fund-ttjj",
  "runtimeArgs": ["-r", "ts-node/register"],
  "args": [
    "${workspaceFolder}/packages/fund-ttjj/core/index.ts",
    "create",
    "demo-name"
  ],
  "env": {
    "TS_NODE_FILES": "true",
    "TS_NODE_PROJECT": "${workspaceFolder}/packages/fund-ttjj/tsconfig.dev.json"
  }
}
```

#### sourcemap

vscode 中调试配置： ts -> js 后，根据 sourcemap 调试 js
tsconfig.dev.js 需配置: sourcemap & incremental（增量编译）
tsc 编译时带上 --listEmittedFiles 可看到当前增量编译的文件名
ps: 最好使用两个版本的 tsconfig.js 因为 debugger 需要 sourcemap，而 npm 正式发包时，并不需要

```json
{
  "type": "node",
  "request": "launch",
  "name": "JS-Debug",
  "program": "${workspaceFolder}/src/index.ts",
  "preLaunchTask": "npm: dev",
  "sourceMaps": true,
  "outFiles": ["${workspaceFolder}/lib/**/*.js"]
}
```
