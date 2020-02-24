"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
exports.fileExistAndBack = (path) => {
    fs_extra_1.default.ensureFileSync(path);
    const data = fs_extra_1.default.readFileSync(path);
    return !data.length ? false : data.toString();
};
