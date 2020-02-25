"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task_1 = tslib_1.__importDefault(require("../../shared/task"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const main = task_1.default.create('分析资产情况');
main.execute(function (callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const helper = this.top.helper;
        const { outputPath } = helper;
        const stat = yield fs_extra_1.default.stat(outputPath);
        console.log(stat);
        callback();
    });
});
exports.default = main;
