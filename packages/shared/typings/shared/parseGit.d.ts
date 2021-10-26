export default class ParseGit {
    static parse(str: string): ParseGit;
    protocol: string;
    gitHost: string;
    projectPath: string;
    private sshGitReg;
    private httpGitReg;
    constructor(str: string);
    get path(): string;
    get ssh(): string;
    get http(): string;
    get url(): string;
    getCommit(commitId: string): string;
    getTree(tree: string): string;
    getBranch(branch: string): string;
}
