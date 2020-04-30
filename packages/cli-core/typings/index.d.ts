import PluginContainer, { IPluginOption } from './plugin';
import { Context } from './content';
import T from './types';
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
    context: CTX | ((ctx: CTX) => CTX);
    pkg: IPackage;
    plugins?: IPluginOption[];
}
export default class CliCore<CTX extends T.DynamicObject> {
    root: string;
    pkg: IPackage;
    ctx: CTX | ((ctx: Context<CTX>) => CTX);
    pluginContainer: PluginContainer;
    constructor({ root, pkg, context, plugins }: ICliCore<CTX>);
    execute(): void;
}
