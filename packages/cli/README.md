# `@oishi/cli`

这里对创建命令进行说明，虽然在创建时、使用 `oishi -h` 或者 `oishi ${command} -h` 时也能看到，但是我还是想啰嗦两句。

## 安装

```bash
# 全局安装指令
npm install -g @oishi/cli
```

## `oishi create:cli`

```bash
# 查看 create:cli 帮助
oishi create:cli -h
# 创建命令行项目，传入 hello 和 say 参数
oishi create:cli hello say
```

如上，我们使用 `create:cli` 快速新建了命令行项目，在控制台可以看到如下输出。尝试走一遍这些命令，你可以在控制台看到对应输出。

```bash
cd hello
node bin/hello.js say baby
node bin/hello.js -h
node bin/hello.js say -h
```

接下来我们直接看目录文件，简单的就在目录上说明，需要关注的我会在下面列出。

```
├── README.md               「README 文件，记得补充你的项目说明」
├── bin
│   └── hello.js            「命令行执行文件，在 package.json 中可以看到 bin 指向了该文件，该文件调用 src/index.js」
├── core                    「核心代码，你需要的就是在这里书写代码，下面会对 core 做详细说明」
│   ├── index.ts
│   └── plugins
│       └── say
│           └── index.ts
├── global.d.ts             「全局 typescript 声明，建议不要改动位置，增加内容即可」
├── package.json            「下面会对 package.json 做详细说明」
├── src                     「通过 tsc 自动编译出来的文件，不做说明」
├── tsconfig.dev.json       「如何在编译器中调试 ts 代码？就需要这个配置，但是这里不做说明」
├── tsconfig.json           「tsc 编译 core 的主要配置」
├── typings                 「通过 tsc 自动编译出来的文件，不做说明」
├── .eslintrc.js            「eslint 的主要配置文件，使用 AlloyTeam ESLint 的规则」
└── .prettierrc.js          「格式化文件对应的规则，可以点进去看每一项内容，请自行修改」
```

### package.json

#### scripts

```json
{
  "build:ts": "rm -rf ./src ./typings && tsc --project ./"
}
```

移除上一次编译后的文件并自动生成编译文件和 `typings`，需要注意的是，命令行里使用的是 `tsc`，这需要依赖全局环境的 `typescript`，如果你希望使用项目内的，可以将命令中的 `tsc` 改为 `/node_modules/.bin/tsc`。

```json
{
  "prepublish": "npm run build:ts"
}
```

这个命令比较特殊，一般我们不会主动调用，是 `npm publish` 之前会调用的钩子命令，为了防止在 publish 的时候忘记编译项目。

#### bin

```json
{
  "hello": "bin/hello.js"
}
```

如上书写，别人全局安装了命令行之后，可以直接使用 `hello ${command}` 来唤起。

#### files

当你发布你的包时，数组里的文件会被传到 npm 上。

### core

该目录为主要写代码的地方，详细该如何写，就给到 `@oicli/cli-core` 的链接吧。

[cli-core 文档](../cli-core/README.md)

## `oishi create:ts`

```bash
# 查看 create:ts 帮助
oishi create:ts -h
# 创建 typescript 项目环境，传入 name 为 my-ts-app
oishi create:ts my-ts-app
```

如上，我们使用 `create:ts` 快速创建了 typescript 项目，在控制台可以看到如下输出。

```bash
cd my-ts-app
yarn
node src/index.js
```
