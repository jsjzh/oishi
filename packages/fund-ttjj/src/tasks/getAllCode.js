"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task_1 = tslib_1.__importDefault(require("../shared/task"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const service_1 = require("../service");
const main = task_1.default.create();
main.excute = (helper) => {
    const apiPath = path_1.default.resolve(helper.dayPath, 'GetMyAssetDetails.json');
    fs_extra_1.default.ensureFileSync(apiPath);
    if (!fs_extra_1.default.readFileSync(apiPath).length) {
        service_1.GetMyAssetDetails().then(data => fs_extra_1.default.writeJSONSync(apiPath, data, { spaces: 2 }));
    }
};
exports.default = main;
