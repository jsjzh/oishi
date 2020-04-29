# oishi

> oishi 是日语「好好次」的发音，日语写作「おいしい」

为什么取这个名字呢？果然还是因为我比较喜欢吃。

## `@oishi/cli`

cli 的功能就是快速创建开发环境，包含 typescript 环境、node 交互式命令行环境，现在不管是公司项目还是个人项目，只要是需要通过命令行来执行的（比如前端脚手架、打包流等等），我都会直接用它。

> 借助 typescript，配合 vscode，你可以在在开发时获得很好的代码提示，开发舒适感 up！强烈推荐。

### 安装

```bash
# 全局安装指令
npm install -g @oishi/cli

# 查看帮助
oishi -h
# 快速创建 typescript 环境
oishi create:ts my-ts-app
# 快速创建 node 交互式命令行环境
oishi create:cli hello say
```

[@oishi/cli 文档](./packages/cli/README.md)

## `@oishi/cli-core`

该库为支撑命令行的底层框架，不建议直接安装，还是通过 `@oishi/cli` 来创建项目比较稳妥。

但是有一说一，文档还是得放在核心库里面，点击如下即可查看。

[@oishi/cli-core 文档](./packages/cli-core/README.md)

## `@oishi/cli-crawler`

说起来，`@oishi/cli-core` 的诞生还是因为想写一个爬虫，当初自己怎么会想到，本来只是想爬一下基金数据，减轻手工操作的负担。。。

鉴于 `@oishi/cli-core` 的特性，爬虫实际代码在 `@oishi/cli-crawler-plugin-ttjj` 中，如果看了 `@oishi/cli-crawler` 的源码就会发现，它只是使用了一个 plugin 而已。

后面还有爬各大基金公开网站上的数据的想法，不过因为优先级比较低，姑且算是个提案。

### 安装

```bash
# 全局安装
npm install -g @oishi/cli-crawler

# 查看帮助
oishi-crawler -h
# 查看 ttjj 的帮助说明
oishi-crawler ttjj -h
# 执行爬虫 ttjj
# 两个 path 都非必须，如果传的话会使用默认值
oishi-crawler ttjj --config <path> --output <path>
```

### 使用说明

因为这个没有太多要说的概念，文档就简单放在这里吧。等后面写了很多爬虫的时候，再把文档放到对应项目中。

如下是需要的 config 格式，当然这个不是随便拿的，还是需要用 charles 爬一下「天天基金」的接口。

~~（所以这个工具我放出来干啥！这么麻烦，还得自己去爬接口）。。。~~

```ts
// config.json 的格式如下
interface IConfig {
  CToken: string;
  MobileKey: string;
  ServerVersion: string;
  UToken: string;
  UserId: string;
}
```
