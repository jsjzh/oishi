"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_core_1 = tslib_1.__importDefault(require("@oishi/cli-core"));
const path_1 = tslib_1.__importDefault(require("path"));
const base_1 = tslib_1.__importDefault(require("./execute/base"));
const business_1 = tslib_1.__importDefault(require("./execute/business"));
class JarvisBundleCli {
    constructor() {
        this.cli = new cli_core_1.default({
            root: process.cwd(),
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            pkg: require('../package.json'),
            context: {},
            plugins: [path_1.default.resolve(__dirname, './command/bundle')],
        });
    }
    static create() {
        return new JarvisBundleCli();
    }
    execute() {
        this.cli.execute();
    }
}
exports.default = JarvisBundleCli;
exports.BundleBaseStore = base_1.default;
exports.BundleBusinessStore = business_1.default;
