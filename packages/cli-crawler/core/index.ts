import CliCore from '@oishi/cli-core';
import path from 'path';

import T from './types';

import helloWorld from './plugins/hello:world';
import boheFood from './plugins/bohe:food';
import cmdbApplication from './plugins/cmdb:application';

const pkg = require('../package.json');

export default class OishiCrawlerCli {
  static create(): OishiCrawlerCli {
    return new OishiCrawlerCli();
  }

  cli: CliCore<T.IContent>;

  constructor() {
    this.cli = new CliCore({
      root: process.cwd(),
      pkg,
      context: {
        // 这里因为使用了 rollup，把打包的文件输出到了 ${root}/lib 下
        // 所以如果想要获取 cliRoot 的话，就到 lib 的上一层，也就是 ../
        // 为什么需要获取 cliRoot 呢？因为使用 rollup 打包的话，我们需要 rollup.config.js
        // 而现在这个配置文件由 cli 提供
        cliRoot: path.resolve(__dirname, '../'),
      },
      plugins: [helloWorld, boheFood, cmdbApplication],
    });
  }

  execute(): void {
    this.cli.execute();
  }
}
