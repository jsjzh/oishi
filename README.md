# oishi

> oishi 是日语「好好次」的发音，日语写作「おいしい」。

## 项目介绍

oishi 项目集，包括了很多有用的工具和命令行，下面会逐一介绍。

### `packages/cli`

#### 使用方式

待补充

### `packages/cli-core`

#### 使用方式

待补充

### `packages/cli-crawler`

#### 使用方式

待补充

### `packages/cli-crawler-plugin-ttjj`

#### 使用方式

待补充

### `packages/oishi-shared`

#### 使用方式

待补充

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
