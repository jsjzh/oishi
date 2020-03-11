import CliCore from '@oishi/cli-core';
import path from 'path';

export interface UserContext {
  message: string;
}

const cli = new CliCore({
  root: process.cwd(),
  pkg: require('../package.json'),
  context: { message: 'hello wrold' },
  plugins: [path.resolve(__dirname, './hello')],
});

cli.execute();
