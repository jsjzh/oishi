import CliCore from '@oishi/cli-core';
import path from 'path';
import _BundleBaseStore from './execute/base';
import _BundleBusinessStore from './execute/business';

export default class JarvisBundleCli {
  static create(): JarvisBundleCli {
    return new JarvisBundleCli();
  }

  cli: CliCore<{}>;

  constructor() {
    this.cli = new CliCore({
      root: process.cwd(),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      pkg: require('../package.json'),
      context: {},
      plugins: [path.resolve(__dirname, './command/bundle')],
    });
  }

  execute(): void {
    this.cli.execute();
  }
}

export const BundleBaseStore = _BundleBaseStore;
export const BundleBusinessStore = _BundleBusinessStore;
