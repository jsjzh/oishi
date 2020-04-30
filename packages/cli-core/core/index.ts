import program from 'commander';

import PluginContainer, {
  IPluginOption,
  ICommandItem,
  OptionsItem,
} from './plugin';

import { createContext, Context } from './content';

import T from './types';

export interface IPackage extends T.DynamicObject {
  name: string;
  version: string;
  description: string;
  engines?: {
    node?: string;
  };
}

export interface ICliCore<CTX> {
  root: string;
  context: CTX | ((ctx: CTX) => CTX);
  pkg: IPackage;
  plugins?: IPluginOption[];
}

export default class CliCore<CTX extends T.DynamicObject> {
  root: string;
  pkg: IPackage;
  ctx: CTX | ((ctx: Context<CTX>) => CTX);
  pluginContainer: PluginContainer;

  constructor({ root, pkg, context, plugins }: ICliCore<CTX>) {
    this.root = root;
    this.pkg = pkg;
    this.ctx = context || {};
    this.pluginContainer = new PluginContainer(root, plugins || []);
  }

  execute(): void {
    program.version(this.pkg.version).usage('<command>');

    this.pluginContainer.traverse((commandItem: ICommandItem<CTX>) => {
      const context = createContext<CTX>(this.root, this.ctx);

      const required = commandItem.command.match(/<(.+?)>/g);
      const optional = commandItem.command.match(/\[(.+?)\]/g);

      const hasRequired = !!required;
      const hasOptional = !!optional;
      const commandHasOptions = hasRequired || hasOptional;

      const requiredUsage = hasRequired && required?.join(' ');
      const optionalUsage = hasRequired && optional?.join(' ');

      const miniProgram = program
        .command(commandItem.command)
        .description(commandItem.description);

      if (hasRequired && hasOptional) {
        miniProgram.usage(`${requiredUsage} ${optionalUsage}`);
      } else {
        if (hasRequired) {
          miniProgram.usage(`${requiredUsage}`);
        } else if (hasOptional) {
          miniProgram.usage(`${optionalUsage}`);
        } else {
          miniProgram.usage(' ');
        }
      }

      commandItem.options.forEach((option: OptionsItem) => {
        miniProgram.option.apply(miniProgram, option);
      });

      miniProgram.action((...args: any[]) => {
        Object.assign(context.argv, miniProgram.opts());
        if (commandHasOptions) {
          const requiredOptions = args.slice(0, -1);
          commandItem.task(requiredOptions, context);
        } else {
          commandItem.task([], context);
        }
      });
    });

    program.parse(process.argv);
  }
}
