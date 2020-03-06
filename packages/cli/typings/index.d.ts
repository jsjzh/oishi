import CliCore from '@oishi/cli-core';
export default class OishiCli {
    static create(): OishiCli;
    cli: CliCore<{}>;
    constructor();
    execute(): void;
}
