import T from './types';
import PluginContainer, { IPluginOption } from './plugin';
import { Context } from './content';
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
    plugins: IPluginOption[];
    pkg?: IPackage;
    context?: CTX | ((ctx: CTX) => CTX);
}
export default class CliCore<CTX extends T.DynamicObject> {
    root: string;
    pkg: IPackage;
    context: CTX | ((ctx: Context<CTX>) => CTX);
    pluginContainer: PluginContainer;
    constructor({ root, pkg, context, plugins }: ICliCore<CTX>);
    execute(): void;
}
