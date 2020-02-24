"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task_1 = tslib_1.__importDefault(require("../shared/task"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const service_1 = require("../service");
const file_1 = require("../shared/file");
const main = task_1.default.create();
main.execute(function (callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const helper = this.top.helper;
        const apiPath = path_1.default.resolve(helper.dayPath, 'GetMyAssetDetails/data.json');
        const data = file_1.fileExistAndBack(apiPath);
        const injectAllCode = (data) => {
            helper.allCode = data.AssetDetails.map((item) => ({
                code: item.FundCode,
                name: item.FundName,
            }));
            callback();
        };
        let saveData;
        if (!data) {
            const rspData = yield service_1.GetMyAssetDetails();
            yield fs_extra_1.default.writeJSON(apiPath, rspData, { spaces: 2 });
            saveData = rspData;
        }
        else {
            saveData = JSON.parse(data);
        }
        injectAllCode(saveData);
    });
});
exports.default = main;
