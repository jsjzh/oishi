import PluginContainer, { IPluginOption } from './pluginContainer';
export interface IPackage extends DynamicObject {
    name: string;
    version: string;
    description: string;
    engines?: {
        node?: string;
    };
}
export interface ICliCore {
    root: string;
    pkg: IPackage;
    plugins: IPluginOption[];
}
export default class CliCore {
    root: string;
    pluginContainer: PluginContainer;
    pkg: IPackage;
    constructor({ root, pkg, plugins }: ICliCore);
    execute(): void;
}
