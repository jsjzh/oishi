interface ILernaPackagesInfo {
    name: string;
    version: string;
    private: boolean;
    location: string;
}
declare type ODependencies = {
    name: string;
    allDeps: Record<string, string[]>;
}[];
export default class ParseDep {
    private root;
    private packageJson;
    private isLerna;
    private hasNpmLock;
    private hasYarnLock;
    constructor(root: string);
    packages(): Pick<ILernaPackagesInfo, "private" | "name" | "version">[];
    output(): ODependencies;
    private __parseLerna;
    private __parseNpmLock;
    private __parseYarnLock;
    private __checkLockFile;
    private __resolve;
}
export {};
