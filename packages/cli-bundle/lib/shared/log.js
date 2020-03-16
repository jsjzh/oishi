"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const curryLog = (logType) => ramda_1.compose(console.log, logType, formatStr);
const formatStr = (str) => str;
const success = curryLog(chalk_1.default.green);
const successBg = curryLog(chalk_1.default.bgGreen.black);
const error = curryLog(chalk_1.default.red);
const errorBg = curryLog(chalk_1.default.bgRed.black);
const info = curryLog(chalk_1.default.yellow);
const infoBg = curryLog(chalk_1.default.bgYellow.black);
exports.default = {
    success,
    successBg,
    error,
    errorBg,
    info,
    infoBg,
};
