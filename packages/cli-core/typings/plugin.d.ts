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
export declare type IPluginOption<T> = string | IPluginInfo | IPlugin<T>;
interface IRegisterCommandConfig {
    command: string;
    description: string;
    options: OptionsItem[];
}
export declare type IPlugin<T> = (pluginAPI: PluginAPI<T>, pluginConfig: T.DynamicObject) => void;
export declare class PluginAPI<CTX extends T.DynamicObject> {
    container: PluginContainer<CTX>;
    constructor(container: PluginContainer<CTX>);
    registerCommand(configs: IRegisterCommandConfig, task: ITask<CTX>): void;
}
export default class PluginContainer<CTX> {
    root: string;
    commands: T.DynamicObject;
    constructor(root: string, plugins: IPluginOption<CTX>[]);
    resolvePlugins(pluginOption: IPluginOption<CTX>): void;
    unifyInfo(pluginOption: IPluginOption<CTX>): IPluginInfo | undefined;
    unifyRequire(pluginPath: string): IPlugin<CTX> | undefined;
    mountedPlugin(pluginInfo: IPluginInfo, plugin: IPlugin<CTX>): void;
    registerCommand<CTX>(configs: IRegisterCommandConfig, task: ITask<CTX>): void;
    traverse<CTX>(fn: (command: ICommandItem<CTX>) => void): void;
}
export {};
