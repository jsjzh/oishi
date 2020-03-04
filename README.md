# oishi

> oishi 是日语「好好次」的发音，日语写作「おいしい」。

## 项目介绍

这个项目中会结合一些好用的库为工具，写一些爬虫代码，具体的项目介绍可以看各 packages 下的介绍

另外，项目管理工具用的是 lerna，谁用谁知道，特好使！

## `packages/fund-shared`

整合了很多在写爬虫代码的时候通用的一些包装过的代码，比如网络请求库，打日志的库，以及自己写的一个队列库等等。

> 特地拆开为 `fund-shared` 和 `fund-ttjj` 有「为了用 lerna 而用」的嫌疑。。。

## `packages/fund-ttjj`

第一个爬虫库，在写该爬虫库的时候，修修改改很多次，为了实现一些功能，不得不对已经写好的代码进行再改造，现在初版已经完成，当然还有很多可以优化的地方，后面还会继续更新，因为远远还没写完～

该库也可以直接使用，后面还有一些想要改造的点，所以暂时没有上传 npm，如果想要使用的话可以先 `git clone` 到本地 `npm install` 使用。（爬虫能上传 npm 么，会不会被封？是不是增加一个「只是为了学习交流使用，请在下载后的 24 小时内删除」比较好？

### 使用手册

#### 前置

1. 要保证 `config/secret.json` 中有所需的数据，需要什么的数据可以看 `core/service/index.ts`，里面有写，而获取这些数据的方法也很简单，打开你的 charles
2. 爬虫爬下来的代码会在 output 中，还未处理，后续想要结合操作 excel 的 node 第三方库做处理

#### 用法

编译的命令行直接打开 `package.json` 查看即可

TaskController
...

Task
...

callback
...

## 待办事项

1. fund-ttjj
   1. 是否要使用 rxjs 重新改造
   2. 是否要写一个函数，可以限制并发数，并且每次发起请求的间隔也可以设置
   3. 是否要考虑支持命令行来快速运行
   4. 如果要支持命令行的话，可以整合多个爬虫指令到一个命令行中运行
2. 是否要创建一个 docker 的镜像，可以使用镜像直接开爬

## node debug

### javascript

vscode 中调试和执行普通 js 文件方式，直接执行编译后的 js 代码，没有 sourcemap 映射到 ts

```json
{
    "type": "node",
    "request": "launch",
    "name": "TEST-Debug",
    "program": "${workspaceFolder}/test/index.js"
},
```

### typescript

#### ts-node

推荐使用 ts-node 直接执行和调试 ts 代码

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
tsconfig.dev.js 需配置: sourcemap & incremental (增量编译)
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
