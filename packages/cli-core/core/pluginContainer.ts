import path from 'path';
import resolve from 'resolve';
import PluginAPI, { ICommandItem } from './pluginAPI';

interface IPluginInfo {
  pluginPath: string;
  pluginConfig: DynamicObject;
}

interface IPlugin {
  name: string;
  apply: any;
}

export type IPluginOption = string | IPluginInfo;

export default class PluginContainer {
  root: string;
  commands: DynamicObject;

  constructor(root: string, plugins: IPluginOption[]) {
    this.root = root;
    this.commands = {};
    plugins.forEach(this.resolvePlugins);
  }

  resolvePlugins(pluginOption: IPluginOption): void {
    const pluginInfo = this.unifyInfo(pluginOption);
    const plugin = this.unifyRequire(pluginInfo.pluginPath);
    this.mountedPlugin(pluginInfo, plugin);
  }

  unifyInfo(pluginOption: IPluginOption): IPluginInfo {
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

  unifyRequire(pluginPath: string): IPlugin {
    const module = require(pluginPath);
    return module && module.__esModule ? module.default : module;
  }

  mountedPlugin(pluginInfo: IPluginInfo, plugin: IPlugin) {
    plugin.apply(
      new PluginAPI(plugin.name, this),
      pluginInfo.pluginConfig || {},
    );
  }

  registerCommand(commandItem: ICommandItem) {
    if (this.commands[commandItem.command]) {
      throw new Error('command 名重复');
    }

    this.commands[commandItem.command] = commandItem;
  }

  traverse(fn: (command: ICommandItem) => any) {
    Object.keys(this.commands).forEach(command => fn(this.commands[command]));
  }
}
