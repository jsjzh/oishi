declare type PDependencies = {
    root: Record<string, {
        versions: string[];
    }>;
} & {
    [k: string]: Record<string, {
        versions: string[];
    }>;
};
export default class ParseDep {
    private root;
    private isLerna;
    private hasNpmLock;
    private hasYarnLock;
    constructor(root: string);
    output(): PDependencies;
    private __parseLerna;
    private __parseNpmLock;
    private __parseYarnLock;
    private __checkLockFile;
    private __resolve;
}
export {};
