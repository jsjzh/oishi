import CliCore from '@oishi/cli-core';
import path from 'path';

import T from './types';

import calorie from './plugins/calorie';

export default class OishiCliHealth {
  static create(): OishiCliHealth {
    return new OishiCliHealth();
  }

  cli: CliCore<T.IContent>;

  constructor() {
    this.cli = new CliCore({
      root: process.cwd(),
      context: {
        // 这里因为使用了 rollup，把打包的文件输出到了 ${roocliRoott}/lib 下
        // 所以如果想要获取 cliRoot 的话，就到 lib 的上一层，也就是 ../
        // 为什么需要获取 cliRoot 呢？因为使用 rollup 打包的话，我们需要 rollup.config.js
        // 而现在这个配置文件由 cli 提供
        cliRoot: path.resolve(__dirname, '../'),
      },
      plugins: [calorie],
    });
  }

  execute(): void {
    this.cli.execute();
  }
}
