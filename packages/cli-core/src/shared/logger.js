"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class Logger {
    _log(str) {
        console.log(str);
    }
    success(str) {
        this._log(chalk_1.default.green(str));
    }
    info(str) {
        this._log(chalk_1.default.yellow(str));
    }
    error(str) {
        this._log(chalk_1.default.red(str));
    }
    successBg(str) {
        this._log(chalk_1.default.bgGreen.black('「SUCCESS」') + chalk_1.default.green(` ${str}`));
    }
    infoBg(str) {
        this._log(chalk_1.default.bgYellow.black('「INFO」') + chalk_1.default.yellow(` ${str}`));
    }
    errorBg(str) {
        this._log(chalk_1.default.bgRed.black('「ERROR」') + chalk_1.default.red(` ${str}`));
    }
    successBgTip(title, str) {
        this._log(chalk_1.default.bgGreen.black(`「${title} SUCCESS」`) + chalk_1.default.green(` ${str}`));
    }
    infoBgTip(title, str) {
        this._log(chalk_1.default.bgYellow.black(`「${title} INFO」`) + chalk_1.default.yellow(` ${str}`));
    }
    errorBgTip(title, str) {
        this._log(chalk_1.default.bgRed.black(`「${title} ERROR」`) + chalk_1.default.red(` ${str}`));
    }
}
exports.Logger = Logger;
exports.default = new Logger();
