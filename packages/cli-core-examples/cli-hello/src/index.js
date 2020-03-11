"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_core_1 = tslib_1.__importDefault(require("@oishi/cli-core"));
const path_1 = tslib_1.__importDefault(require("path"));
const cli = new cli_core_1.default({
    root: process.cwd(),
    pkg: require('../package.json'),
    context: { message: 'hello wrold' },
    plugins: [path_1.default.resolve(__dirname, './hello')],
});
cli.execute();
