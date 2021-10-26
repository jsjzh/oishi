export default class ParseGit {
  static parse(str: string) {
    return new ParseGit(str);
  }

  protocol: string;
  gitHost: string;
  projectPath: string;

  private sshGitReg = /^git\@(.+?):(.+?)$/g;
  private httpGitReg = /(https?)\:\/\/(.+?)\/(.+)/g;

  constructor(str: string) {
    let _str = str.trim();

    _str = _str.endsWith('.git') ? _str.slice(0, -4) : _str;

    const sshMatched = this.sshGitReg.exec(_str);
    const httpMatched = this.httpGitReg.exec(_str);

    this.protocol = sshMatched
      ? 'https'
      : (httpMatched && httpMatched[1]) || 'unknown';

    this.gitHost = sshMatched
      ? sshMatched[1]
      : (httpMatched && httpMatched[2]) || 'unknown';

    this.projectPath = sshMatched
      ? sshMatched[2]
      : (httpMatched && httpMatched[3]) || 'unknown';
  }

  get path() {
    return this.projectPath;
  }

  get ssh() {
    return `git@${this.gitHost}:${this.projectPath}.git`;
  }

  get http() {
    return `${this.protocol}://${this.gitHost}/${this.projectPath}.git`;
  }

  get url() {
    return `${this.protocol}://${this.gitHost}/${this.projectPath}`;
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
