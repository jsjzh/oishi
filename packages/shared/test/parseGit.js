const { ParseGit } = require('../lib');

const parseGit = ParseGit.parse(
  'git@git.souche-inc.com:devops-demo/tower-h5-demo.git',
);

console.log('parseGit --- protocol', parseGit.protocol);
console.log('parseGit --- gitHost', parseGit.gitHost);
console.log('parseGit --- projectPath', parseGit.projectPath);
console.log('parseGit --- path', parseGit.path);
console.log('parseGit --- ssh', parseGit.ssh);
console.log('parseGit --- https', parseGit.https);
console.log('parseGit --- url', parseGit.url);
console.log('parseGit --- getCommit', parseGit.getCommit('123'));
console.log('parseGit --- getTree', parseGit.getTree('123'));
console.log('parseGit --- getBranch', parseGit.getBranch('123'));
console.log();

const parseGit2 = ParseGit.parse(
  'https://git.souche-inc.com/devops-demo/tower-h5-demo.git',
);

console.log('parseGit2 --- protocol', parseGit2.protocol);
console.log('parseGit2 --- gitHost', parseGit2.gitHost);
console.log('parseGit2 --- projectPath', parseGit2.projectPath);
console.log('parseGit2 --- path', parseGit2.path);
console.log('parseGit2 --- ssh', parseGit2.ssh);
console.log('parseGit2 --- https', parseGit2.https);
console.log('parseGit2 --- url', parseGit2.url);
console.log('parseGit2 --- getCommit', parseGit2.getCommit('123'));
console.log('parseGit2 --- getTree', parseGit2.getTree('123'));
console.log('parseGit2 --- getBranch', parseGit2.getBranch('123'));
console.log();

const parseGit3 = ParseGit.parse(
  'https://git.souche-inc.com/devops-demo/tower-h5-demo',
);

console.log('parseGit3 --- protocol', parseGit3.protocol);
console.log('parseGit3 --- gitHost', parseGit3.gitHost);
console.log('parseGit3 --- projectPath', parseGit3.projectPath);
console.log('parseGit3 --- path', parseGit3.path);
console.log('parseGit3 --- ssh', parseGit3.ssh);
console.log('parseGit3 --- https', parseGit3.https);
console.log('parseGit3 --- url', parseGit3.url);
console.log('parseGit3 --- getCommit', parseGit3.getCommit('123'));
console.log('parseGit3 --- getTree', parseGit3.getTree('123'));
console.log('parseGit3 --- getBranch', parseGit3.getBranch('123'));
console.log();

console.log(parseGit.protocol === parseGit2.protocol);
console.log(parseGit.gitHost === parseGit2.gitHost);
console.log(parseGit.projectPath === parseGit2.projectPath);
console.log(parseGit.path === parseGit2.path);
console.log(parseGit.ssh === parseGit2.ssh);
console.log(parseGit.https === parseGit2.https);
console.log(parseGit.url === parseGit2.url);
console.log(parseGit.getCommit('123') === parseGit2.getCommit('123'));
console.log(parseGit.getTree('123') === parseGit2.getTree('123'));
console.log(parseGit.getBranch('123') === parseGit2.getBranch('123'));

console.log(parseGit.protocol === parseGit3.protocol);
console.log(parseGit.gitHost === parseGit3.gitHost);
console.log(parseGit.projectPath === parseGit3.projectPath);
console.log(parseGit.path === parseGit3.path);
console.log(parseGit.ssh === parseGit3.ssh);
console.log(parseGit.https === parseGit3.https);
console.log(parseGit.url === parseGit3.url);
console.log(parseGit.getCommit('123') === parseGit3.getCommit('123'));
console.log(parseGit.getTree('123') === parseGit3.getTree('123'));
console.log(parseGit.getBranch('123') === parseGit3.getBranch('123'));
