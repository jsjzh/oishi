export default class ParseGit {
    private sshReg;
    private httpsReg;
    private protocol;
    private gitHost;
    private projectpath;
    constructor(str: string);
    get ssh(): string;
    get https(): string;
    get url(): string;
    getCommit(commitId: string): string;
    getTree(tree: string): string;
    getBranch(branch: string): string;
}
