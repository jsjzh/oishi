import { ICommandItem } from './pluginAPI';
interface IPluginInfo {
    pluginPath: string;
    pluginConfig: DynamicObject;
}
interface IPlugin {
    name: string;
    apply: any;
}
export declare type IPluginOption = string | IPluginInfo;
export default class PluginContainer {
    root: string;
    commands: DynamicObject;
    constructor(root: string, plugins: IPluginOption[]);
    resolvePlugins(pluginOption: IPluginOption): void;
    unifyInfo(pluginOption: IPluginOption): IPluginInfo;
    unifyRequire(pluginPath: string): IPlugin;
    mountedPlugin(pluginInfo: IPluginInfo, plugin: IPlugin): void;
    registerCommand(commandItem: ICommandItem): void;
    traverse(fn: (command: ICommandItem) => any): void;
}
export {};
