interface IModuleInfo {
    id: number;
    path: string;
}
export default class BundleBusinessStore {
    entry: string;
    target: 'ios' | 'android';
    paths: {
        projectPath: string;
        bundleToolsPath: string;
        businessModuleMapPath: string;
    };
    businessModuleId: number;
    baseModuleMap: IModuleInfo[];
    businessModuleMap: IModuleInfo[];
    constructor();
    resolvePath(): void;
    createEmptyConfigMap(): Promise<void>;
    cacheConfigModuleMap(): void;
    pathToModuleId(modulePath: string): number;
    createModuleIdFactory(): (path: string) => number;
    processModuleFilter(module: any): boolean;
    getModulesRunBeforeMainModule(): never[];
}
export {};
