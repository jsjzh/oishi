interface IModuleInfo {
    id: number;
    path: string;
}
export default class BundleBaseStore {
    entry: string;
    target: 'ios' | 'android';
    paths: {
        projectPath: string;
        bundleToolsPath: string;
        baseModuleMapPath: string;
    };
    baseModuleId: number;
    baseModuleMap: IModuleInfo[];
    constructor();
    resolvePath(): void;
    createEmptyConfigMap(): Promise<void>;
    saveModuleMap(): void;
    pathToModuleId(modulePath: string): number;
    createModuleIdFactory(): (path: string) => number;
}
export {};
