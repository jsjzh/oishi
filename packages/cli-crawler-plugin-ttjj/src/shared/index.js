"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const ramda_1 = require("ramda");
const moment_1 = tslib_1.__importDefault(require("moment"));
exports.curryGetAbsolutePath = ramda_1.curry((root, inputPath) => path_1.default.isAbsolute(inputPath) ? inputPath : path_1.default.resolve(root, inputPath));
exports.curryTimePath = ramda_1.curry(((now) => (basePath, filePath) => path_1.default.join(basePath, `${now.format('YYYY')} 年`, `${now.format('MM')} 月`, `${now.format('DD')} 日`, filePath))(moment_1.default()));
exports.sleep = (second) => new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, second * 1000);
});
exports.getCodePath = (basePath, code, name) => path_1.default.join(basePath, `${code} - ${name}.json`);
