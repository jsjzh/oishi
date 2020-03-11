"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const ramda_1 = require("ramda");
const moment_1 = tslib_1.__importDefault(require("moment"));
const fs_extra_1 = require("fs-extra");
exports.curryGetAbsolutePath = ramda_1.curry((root, inputPath) => path_1.default.isAbsolute(inputPath) ? inputPath : path_1.default.resolve(root, inputPath));
exports.curryTimePath = ramda_1.curry(((now) => (basePath, filePath) => path_1.default.join(basePath, `${now.format('YYYY')} 年`, `${now.format('MM')} 月`, `${now.format('DD')} 日`, filePath))(moment_1.default()));
exports.sleep = (second) => new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, second * 1000);
});
exports.getCodePath = (basePath, code, name) => path_1.default.join(basePath, `${code} - ${name}.json`);
exports.createFundTasks = (title, codeLists, savePath, request) => {
    return codeLists.map(({ name, code }) => {
        const codePath = exports.getCodePath(savePath, code, name);
        return {
            title: `${title} ${code} ${name}`,
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const rspData = yield request({
                    FundCode: code,
                });
                yield Promise.all([
                    fs_extra_1.ensureFile(codePath),
                    fs_extra_1.writeJSON(codePath, rspData, { spaces: 2 }),
                ]);
                return exports.sleep(3);
            }),
        };
    });
};
