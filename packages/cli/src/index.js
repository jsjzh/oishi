import CliCore from '@oishi/cli-core';
import path from 'path';
export default class OishiCli {
    constructor() {
        this.cli = new CliCore({
            root: process.cwd(),
            pkg: require('../package.json'),
            context: {},
            plugins: [
                path.resolve(__dirname, './plugins/create:cli'),
                path.resolve(__dirname, './plugins/create:plg'),
                path.resolve(__dirname, './plugins/create:ts'),
            ],
        });
    }
    static create() {
        return new OishiCli();
    }
    execute() {
        this.cli.execute();
    }
}
