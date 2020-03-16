"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const validate_npm_package_name_1 = tslib_1.__importDefault(require("validate-npm-package-name"));
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs_extra_1 = require("fs-extra");
class Helper {
    constructor(ctx) {
        this.ctx = ctx;
    }
    validatePkgName(name) {
        const { errors, validForNewPackages, warnings } = validate_npm_package_name_1.default(name);
        if (!validForNewPackages) {
            if (errors)
                return errors.join(' ');
            if (warnings)
                return warnings.join(' ');
        }
    }
    copyTempToCwd(template) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.copy(template, this.ctx.root);
        });
    }
    getGitConfig(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout } = yield execa_1.default('git', ['config', '--get', props], {
                    cwd: this.ctx.root,
                });
                return stdout;
            }
            catch (error) {
                this.ctx.logger.info(`git config --git ${props} not find`);
                return 'not find';
            }
        });
    }
}
exports.default = Helper;
