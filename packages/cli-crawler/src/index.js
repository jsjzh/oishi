import CliCore from '@oishi/cli-core';
export default class OishiCrawlerCli {
    constructor() {
        this.cli = new CliCore({
            root: process.cwd(),
            plugins: [],
        });
    }
    static create() {
        return new OishiCrawlerCli();
    }
    execute() {
        this.cli.execute();
    }
}
