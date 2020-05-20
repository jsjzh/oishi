# 使用说明

项目可以作为 node 三方库的基础模板，为什么要强调 node 呢，因为没有做 babel 的转换啥的，在 node 环境下大都也不需要，即使真的有啥不兼容的，用 tslib 也足够了。

js 项目有这么几种，一种是运行在 node 环境下的，一种是运行在浏览器环境下的，浏览器环境下处理会复杂一些，比如需要解析 css html images 等等，更适合用 webpack（或者 parcel？） 进行依赖处理。

运行在 node 环境下的，针对打包出来的应用又可以分为两种，一种是作为第三方库的，那就需要 index.d.ts 声明文件，一种是作为 cli 工具的。

第一种直接使用这个基础项目即可，如果是想创建 cli 项目，可以在创建的时候使用 create:cli 指令。

该项目为最简 typescript 项目配置，创建完项目之后，执行以下几个步骤即可，打包工具使用了 rollup，是专门针对 lib 类型的库进行打包的。

```
npm install --registry=https://registry.npm.taobao.org/
npm run build
npm run test
```

上面命令对应的脚本可以在 `package.json` 文件中找到。
