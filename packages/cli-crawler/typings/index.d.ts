import CliCore from '@oishi/cli-core';
export default class OishiCrawlerCli {
    static create(): OishiCrawlerCli;
    cli: CliCore<{}>;
    constructor();
    execute(): void;
}
