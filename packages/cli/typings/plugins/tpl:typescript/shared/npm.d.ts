import { DynamicObject } from '../template/global';
export interface NpmConfig {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    main: string;
    types: string;
    files: string[];
    scripts: DynamicObject;
}
export default class NpmManager {
    from: string;
    pkgTpl: NpmConfig;
    constructor(from: string);
    setProps(props: keyof NpmConfig, value: any): NpmManager;
    rewrite(): Promise<void>;
}
