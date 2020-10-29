export default class ParseGit {
  private sshReg = /^git\@(.+?):(.+?)\.git$/g;
  private httpsReg = /(https?)\:\/\/(.+?)\/(.+)/g;

  private protocol: string;
  private gitHost: string;
  private projectpath: string;

  constructor(str: string) {
    const sshMatched = this.sshReg.exec(str);
    const httpsMatched = this.httpsReg.exec(str);

    if (!sshMatched && !httpsMatched) throw new Error('输入 git str 格式错误');

    this.protocol = sshMatched ? 'https' : (httpsMatched as any)[1];
    this.gitHost = sshMatched ? sshMatched[1] : (httpsMatched as any)[2];
    this.projectpath = sshMatched ? sshMatched[2] : (httpsMatched as any)[3];
  }

  get ssh() {
    return `git@${this.gitHost}:${this.projectpath}.git`;
  }

  get https() {
    return `${this.protocol}://${this.gitHost}/${this.projectpath}.git`;
  }

  get url() {
    return `${this.protocol}://${this.gitHost}/${this.projectpath}`;
  }

  getCommit(commitId: string) {
    return `${this.url}/commit/${commitId}`;
  }

  getTree(tree: string) {
    return `${this.url}/tree/${tree}`;
  }

  getBranch(branch: string) {
    return this.getTree(branch);
  }
}
