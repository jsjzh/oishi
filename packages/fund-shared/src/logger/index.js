"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class Logger {
    success(str) {
        console.log(chalk_1.default.green(str));
    }
    successBg(str) {
        console.log(chalk_1.default.bgGreen.black(str));
    }
    error(str) {
        console.log(chalk_1.default.red(str));
    }
    errorBg(str) {
        console.log(chalk_1.default.bgRed.black(str));
    }
    info(str) {
        console.log(chalk_1.default.yellow(str));
    }
    infoBg(str) {
        console.log(chalk_1.default.bgYellow.black(str));
    }
}
exports.Logger = Logger;
exports.default = new Logger();
