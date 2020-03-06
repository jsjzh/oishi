import CliCore from '@oishi/cli-core';
import path from 'path';

export default class OishiCli {
  static create(): OishiCli {
    return new OishiCli();
  }

  cli: CliCore<{}>;

  constructor() {
    this.cli = new CliCore({
      root: process.cwd(),
      pkg: require('../package.json'),
      context: {},
      plugins: [path.resolve(__dirname, './plugins/info')],
    });
  }

  execute(): void {
    this.cli.execute();
  }
}
