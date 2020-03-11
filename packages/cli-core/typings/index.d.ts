import PluginContainer, { IPluginOption } from './plugin';
import { Context } from './content';
import { DynamicObject } from '../global';
export interface IPackage extends DynamicObject {
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
export default class CliCore<CTX extends DynamicObject> {
    root: string;
    pkg: IPackage;
    ctx: CTX | ((ctx: Context<CTX>) => CTX);
    pluginContainer: PluginContainer;
    constructor({ root, pkg, context, plugins }: ICliCore<CTX>);
    execute(): void;
}
