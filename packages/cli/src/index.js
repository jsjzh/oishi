import CliCore from '@oishi/cli-core';
import createCli from './plugins/create:cli';
import createPlg from './plugins/create:plg';
import createTs from './plugins/create:ts';
export default new CliCore({
    root: process.cwd(),
    plugins: [createCli, createPlg, createTs],
});
