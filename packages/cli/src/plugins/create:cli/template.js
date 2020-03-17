"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templates = [
    {
        type: 'bin',
        path: 'bin/<% name %>.js',
        value: `#!/usr/bin/env node

const cli = require('../src').default;
cli.create().execute();
`,
    },
    {
        type: 'core',
        path: 'core/index.ts',
        value: `import CliCore from "@oishi/cli-core";
import path from "path";

interface UserData {
  userName: string;
  userEmail: string;
  userGit: string;
}

export default class Cli {
  public static create(): Cli {
    return new Cli();
  }

  // 需要传入 context 否则 context 校验会出错
  private cli: CliCore<UserData>;

  public constructor() {
    this.cli = new CliCore({
      root: process.cwd(),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      pkg: require("../package.json"),
      // 这里设置的 context 会经过 assgin
      // 使用 plugin 时，透传到 ctx 上
      context: {
        userName: "jsjzh",
        userEmail: "kimimi_king@163.com",
        userGit: "https://github.com/jsjzh"
      },
      plugins: [path.resolve(__dirname, './plugins/<% command %>')]
    });
  }

  public execute(): void {
    this.cli.execute();
  }
}
`,
    },
];
exports.default = templates;
