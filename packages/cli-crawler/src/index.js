import CliCore from '@oishi/cli-core';
import path from 'path';
import food from './plugins/food';
export default class OishiCrawlerCli {
    constructor() {
        this.cli = new CliCore({
            root: process.cwd(),
            context: {
                cliRoot: path.resolve(__dirname, '../'),
            },
            plugins: [food],
        });
    }
    static create() {
        return new OishiCrawlerCli();
    }
    execute() {
        this.cli.execute();
    }
}
