import program from 'commander';

import PluginContainer, {
  IPluginOption,
  ICommandItem,
  OptionsItem,
} from './plugin';
import { createContext, Context } from './content';

export interface IPackage extends DynamicObject {
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

export default class CliCore<CTX extends DynamicObject> {
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
    program.version(this.pkg.version).usage('<command> [options]');

    this.pluginContainer.traverse((commandItem: ICommandItem<CTX>) => {
      const context = createContext<CTX>(this.root, this.ctx);

      const commandHasOptions =
        !!commandItem.command.match(/<(.+?)>/g) ||
        !!commandItem.command.match(/\[(.+?)\]/g);

      const miniProgram = program
        .command(commandItem.command)
        .description(commandItem.description);

      commandItem.options.forEach((option: OptionsItem) => {
        miniProgram.option.apply(miniProgram, option);
      });

      miniProgram.action((...args: any[]) => {
        Object.assign(context.argv, miniProgram.opts());
        // 如果 commond 中含有 <...> 或者 [...]
        // 则需要做处理，提取最后一个参数「options 的参数」
        // 也就是说，task 接收到的参数是 >= 1 的，而且会随着 commond 中 hasOptions 的增加而增加
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
