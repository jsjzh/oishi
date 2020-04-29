import CliCore from '@oishi/cli-core';

export default class OishiCrawlerCli {
  static create(): OishiCrawlerCli {
    return new OishiCrawlerCli();
  }

  cli: CliCore<{}>;

  constructor() {
    this.cli = new CliCore({
      root: process.cwd(),
      pkg: require('../package.json'),
      context: {},
      plugins: [],
    });
  }

  execute(): void {
    this.cli.execute();
  }
}
