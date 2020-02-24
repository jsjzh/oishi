"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function success(str) {
    console.log(chalk_1.default.green(str));
}
function successBg(str) {
    console.log(chalk_1.default.bgGreen.black(str));
}
function error(str) {
    console.log(chalk_1.default.red(str));
}
function errorBg(str) {
    console.log(chalk_1.default.bgRed.black(str));
}
function info(str) {
    console.log(chalk_1.default.yellow(str));
}
function infoBg(str) {
    console.log(chalk_1.default.bgYellow.black(str));
}
exports.default = {
    success,
    successBg,
    error,
    errorBg,
    info,
    infoBg,
};
