import path from 'path';
import resolve from 'resolve';
import { Context } from './content';
import T from './types';
import oishiError from './shared/error';

export type OptionsItem = [string, (string | undefined)?, any?];

type ITask<CTX> = (required: string[], ctx: Context<CTX>) => Promise<any>;

// 对外输出处理的 commandItem
export interface ICommandItem<CTX> {
  command: string;
  description: string;
  options: OptionsItem[];
  task: ITask<CTX>;
}

interface IPluginInfo {
  pluginPath: string;
  pluginConfig?: T.DynamicObject;
}

// plugin 的类型
export type IPluginOption<T> = string | IPluginInfo | IPlugin<T>;

interface IRegisterCommandConfig {
  command: string;
  description: string;
  options: OptionsItem[];
}

// 解析后的 plugin
export type IPlugin<T> = (
  pluginAPI: PluginAPI<T>,
  pluginConfig: T.DynamicObject,
) => void;

export class PluginAPI<CTX extends T.DynamicObject> {
  container: PluginContainer<CTX>;

  constructor(container: PluginContainer<CTX>) {
    this.container = container;
  }

  registerCommand(configs: IRegisterCommandConfig, task: ITask<CTX>): void {
    this.container.registerCommand(configs, task);
  }
}

export default class PluginContainer<CTX> {
  root: string;
  commands: T.DynamicObject;

  constructor(root: string, plugins: IPluginOption<CTX>[]) {
    this.root = root;
    this.commands = {};
    plugins.forEach(this.resolvePlugins.bind(this));
  }

  resolvePlugins(pluginOption: IPluginOption<CTX>): void {
    if (typeof pluginOption !== 'function') {
      const pluginInfo = this.unifyInfo(pluginOption);
      const plugin = pluginInfo && this.unifyRequire(pluginInfo.pluginPath);
      plugin && pluginInfo && this.mountedPlugin(pluginInfo, plugin);
    } else {
      this.mountedPlugin(
        {
          pluginPath: '',
          pluginConfig: {},
        },
        pluginOption,
      );
    }
  }

  unifyInfo(pluginOption: IPluginOption<CTX>): IPluginInfo | void {
    if (typeof pluginOption === 'function') return;
    const pluginInfo =
      typeof pluginOption === 'string'
        ? { pluginPath: pluginOption, pluginConfig: {} }
        : pluginOption;

    if (/^(\.|\.\.)/.test(pluginInfo.pluginPath)) {
      pluginInfo.pluginPath = path.resolve(this.root, pluginInfo.pluginPath);
    }

    if (!path.isAbsolute(pluginInfo.pluginPath)) {
      try {
        // 直接查找，插件可能在 plugin 的 node_modules 下
        require.resolve(pluginInfo.pluginPath);
      } catch (e) {
        // 插件也可能在项目的 node_modules 下
        pluginInfo.pluginPath = resolve.sync(pluginInfo.pluginPath, {
          basedir: this.root,
        });
      }
    }
    return pluginInfo;
  }

  unifyRequire(pluginPath: string): IPlugin<CTX> | void {
    if (typeof pluginPath === 'function') return;
    const module = require(pluginPath);
    return module && module.__esModule ? module.default : module;
  }

  mountedPlugin(pluginInfo: IPluginInfo, plugin: IPlugin<CTX>) {
    plugin(new PluginAPI(this), pluginInfo.pluginConfig || {});
  }

  registerCommand<CTX>(configs: IRegisterCommandConfig, task: ITask<CTX>) {
    if (this.commands[configs.command]) {
      throw oishiError.createError('command 名重复');
    }

    const description = configs.description;
    const options = configs.options;
    const commondItem: ICommandItem<CTX> = {
      command: configs.command,
      description,
      options,
      task,
    };

    this.commands[configs.command] = commondItem;
  }

  traverse<CTX>(fn: (command: ICommandItem<CTX>) => void) {
    Object.keys(this.commands).forEach((command) => fn(this.commands[command]));
  }
}
