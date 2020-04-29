"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_core_1 = tslib_1.__importDefault(require("@oishi/cli-core"));
class OishiCrawlerCli {
    constructor() {
        this.cli = new cli_core_1.default({
            root: process.cwd(),
            pkg: require('../package.json'),
            context: {},
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
exports.default = OishiCrawlerCli;
