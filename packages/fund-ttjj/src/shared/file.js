"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
exports.fileExistAndBack = (path) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield fs_extra_1.default.ensureFile(path);
    const data = yield fs_extra_1.default.readFile(path);
    return !data.length ? false : data.toString();
});
