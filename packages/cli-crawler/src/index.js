import CliCore from '@oishi/cli-core';
import path from 'path';
import helloWorld from './plugins/hello:world';
import boheFood from './plugins/bohe:food';
import cmdbApplication from './plugins/cmdb:application';
const pkg = require('../package.json');
export default class OishiCrawlerCli {
    constructor() {
        this.cli = new CliCore({
            root: process.cwd(),
            pkg,
            context: {
                cliRoot: path.resolve(__dirname, '../'),
            },
            plugins: [helloWorld, boheFood, cmdbApplication],
        });
    }
    static create() {
        return new OishiCrawlerCli();
    }
    execute() {
        this.cli.execute();
    }
}
