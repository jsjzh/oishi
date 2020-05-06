import { Context } from './content';
import T from './types';
export declare type OptionsItem = [string, (string | undefined)?, any?];
declare type ITask<CTX> = (required: string[], ctx: Context<CTX>) => Promise<any>;
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
export declare type IPluginOption = string | IPluginInfo | IPlugin;
interface IRegisterCommandConfig {
    command: string;
    description: string;
    options: OptionsItem[];
}
export declare type IPlugin = (pluginAPI: PluginAPI, pluginConfig: T.DynamicObject) => void;
export declare class PluginAPI<CTX extends T.DynamicObject = {}> {
    container: PluginContainer;
    constructor(container: PluginContainer);
    registerCommand(configs: IRegisterCommandConfig, task: ITask<CTX>): void;
}
export default class PluginContainer {
    root: string;
    commands: T.DynamicObject;
    constructor(root: string, plugins: IPluginOption[]);
    resolvePlugins(pluginOption: IPluginOption): void;
    unifyInfo(pluginOption: IPluginOption): IPluginInfo | void;
    unifyRequire(pluginPath: string): IPlugin | void;
    mountedPlugin(pluginInfo: IPluginInfo, plugin: IPlugin): void;
    registerCommand<CTX>(configs: IRegisterCommandConfig, task: ITask<CTX>): void;
    traverse<CTX>(fn: (command: ICommandItem<CTX>) => void): void;
}
export {};
