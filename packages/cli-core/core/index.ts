import T from './types';
import PluginContainer, {
  IPluginOption,
  ICommandItem,
  OptionsItem,
} from './plugin';
import { createContext, Context } from './content';
import { readJSONSync } from 'fs-extra';
import logger from './shared/logger';
import program, { Command } from 'commander';
import path from 'path';
import chalk from 'chalk';
import leven from 'leven';

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
  plugins: IPluginOption<CTX>[];
  pkg?: IPackage;
  context?: CTX | ((ctx: CTX) => CTX);
}

export default class CliCore<CTX extends T.DynamicObject> {
  root: string;
  pkg: IPackage;
  context: CTX | ((ctx: Context<CTX>) => CTX);
  pluginContainer: PluginContainer<CTX>;

  constructor({ root, pkg, context, plugins }: ICliCore<CTX>) {
    this.root = root;
    this.context = context ? context : (): any => ({});
    this.pluginContainer = new PluginContainer(root, plugins || []);

    let _pkg = pkg;

    if (!_pkg) {
      try {
        _pkg = readJSONSync(path.resolve(root, 'package.json'));
      } catch (error) {
        _pkg = {} as any;
      }
    }
    this.pkg = _pkg as IPackage;
  }

  execute(): void {
    program
      .version(this.pkg.version)
      .usage('<command>')
      .action(({ args: [inputCommand] }) => {
        program.outputHelp();
        console.log();
        logger.error(`Unknown command ${inputCommand}`);
        console.log();
        let suggestion = '';

        program.commands
          .map((cmd: Command) => cmd.name())
          .forEach((cmd: string) => {
            const isBestMatch =
              leven(cmd, inputCommand) < leven(suggestion, inputCommand);
            if (leven(cmd, inputCommand) < 3 && isBestMatch) {
              suggestion = cmd;
            }
          });

        if (suggestion) {
          logger.info(`Did you mean ${suggestion}?`);
        }
      });

    this.pluginContainer.traverse((commandItem: ICommandItem<CTX>) => {
      const context = createContext<CTX>(this.root, this.context);

      const required = commandItem.command.match(/<(.+?)>/g);
      const optional = commandItem.command.match(/\[(.+?)\]/g);

      const hasRequired = !!required;
      const hasOptional = !!optional;
      const commandHasOptions = hasRequired || hasOptional;

      const requiredUsage = hasRequired && required && required.join(' ');
      const optionalUsage = hasRequired && optional && optional.join(' ');

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
