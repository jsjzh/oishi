"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
exports.ensureCli = (cli, command = '--version') => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        if (Array.isArray(cli)) {
            for (const _cli of cli) {
                yield execa_1.default(_cli, [command]);
            }
        }
        else {
            yield execa_1.default(cli, [command]);
        }
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.getGitConfig = (props, cwd) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa_1.default('git', ['config', '--get', props], { cwd });
    return stdout ? stdout : '';
});
exports.getLatestVersion = (dep) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa_1.default('npm', ['info', dep, 'version'], {
        stdio: 'pipe',
    });
    return stdout ? stdout : '';
});
