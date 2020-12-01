export default class ParseDep {
    private root;
    private hasNpmLock;
    private hasYarnLock;
    constructor(root: string);
    output(): Record<string, {
        versions: string[];
    }>;
    private __parseNpmLock;
    private __parseYarnLock;
    private __checkLockFile;
    private __resolve;
}
