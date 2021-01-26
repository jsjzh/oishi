export default class ParseGit {
  private sshReg = /^git\@(.+?):(.+?)\.git$/g;
  private httpsReg = /(https?)\:\/\/(.+?)\/(.+)/g;

  private protocol: string;
  private gitHost: string;
  private projectpath: string;

  constructor(str: string) {
    const sshMatched = this.sshReg.exec(str);
    const httpsMatched = this.httpsReg.exec(str);

    this.protocol = sshMatched
      ? 'https'
      : (httpsMatched && (httpsMatched as any)[1]) || 'unknown';

    this.gitHost = sshMatched
      ? sshMatched[1]
      : (httpsMatched && (httpsMatched as any)[2]) || 'unknown';

    this.projectpath = sshMatched
      ? sshMatched[2]
      : (httpsMatched && (httpsMatched as any)[3]) || 'unknown';
  }

  get path() {
    return this.projectpath;
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
