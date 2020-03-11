import { Context } from './content';
import { DynamicObject } from '../global';
export declare type OptionsItem = [string, (string | undefined)?, any?];
declare type ITask<CTX> = (require: any[], ctx: Context<CTX>) => Promise<any>;
export interface ICommandItem<CTX> {
    command: string;
    description: string;
    options: OptionsItem[];
    task: ITask<CTX>;
}
interface IPluginInfo {
    pluginPath: string;
    pluginConfig: DynamicObject;
}
export declare type IPluginOption = string | IPluginInfo;
interface IRegisterCommandConfig {
    command: string;
    description: string;
    options: OptionsItem[];
}
export declare type IPlugin = (pluginAPI: PluginAPI, pluginConfig: DynamicObject) => void;
export declare class PluginAPI<CTX extends DynamicObject = {}> {
    container: PluginContainer;
    constructor(container: PluginContainer);
    registerCommand(configs: IRegisterCommandConfig, task: ITask<CTX>): void;
}
export default class PluginContainer {
    root: string;
    commands: DynamicObject;
    constructor(root: string, plugins: IPluginOption[]);
    resolvePlugins(pluginOption: IPluginOption): void;
    unifyInfo(pluginOption: IPluginOption): IPluginInfo;
    unifyRequire(pluginPath: string): IPlugin;
    mountedPlugin(pluginInfo: IPluginInfo, plugin: IPlugin): void;
    registerCommand<CTX>(configs: IRegisterCommandConfig, task: ITask<CTX>): void;
    traverse<CTX>(fn: (command: ICommandItem<CTX>) => void): void;
}
export {};
