import PluginContainer from './pluginContainer';
export interface IRegisterCommandConfig {
    description: string;
    options: IRegisterCommandOption[];
}
export interface ICommandItem {
    command: string;
    description: string;
    options: IRegisterCommandOption[];
    task: () => any;
}
declare type flagOption = string;
declare type descOption = string;
export declare type IRegisterCommandOption = [flagOption, descOption];
export default class PluginAPI {
    name: string;
    container: PluginContainer;
    constructor(name: string, container: PluginContainer);
    registerCommand(command: string, configs: IRegisterCommandConfig, task: () => any): void;
}
export {};
