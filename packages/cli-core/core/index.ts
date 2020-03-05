import program from 'commander';
import minimist from 'minimist';

import PluginContainer, { IPluginOption } from './pluginContainer';
// import createHelper, { OCreateHelper, ICreateHelper } from './helper';
import { ICommandItem } from './pluginAPI';

export interface IPackage extends DynamicObject {
  name: string;
  version: string;
  description: string;
  engines?: {
    node?: string;
  };
}

export interface ICliCore {
  root: string;
  pkg: IPackage;
  plugins: IPluginOption[];
  // helperOptions: ICreateHelper;
}

export default class CliCore {
  root: string;
  pluginContainer: PluginContainer;
  pkg: IPackage;
  // helper: OCreateHelper;

  constructor({ root, pkg, plugins }: ICliCore) {
    this.root = root;
    this.pkg = pkg;
    // this.helper = createHelper(helperOptions);
    this.pluginContainer = new PluginContainer(root, plugins);
  }

  execute(): void {
    program.version(this.pkg.version).usage('<command> [options]');

    this.pluginContainer.traverse((command: ICommandItem) => {
      program.command(command.command).description(command.description);
      command.options.forEach(option => program.option.apply(null, option));
      program.action(() => {
        command.task();
      });
    });

    program.parse(process.argv);
  }
}
