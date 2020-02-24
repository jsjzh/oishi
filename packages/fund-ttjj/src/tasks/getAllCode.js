"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task_1 = tslib_1.__importDefault(require("../shared/task"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const service_1 = require("../service");
const main = task_1.default.create();
main.execute(function (callback) {
    const helper = this.top.helper;
    const apiPath = path_1.default.resolve(helper.dayPath, 'GetMyAssetDetails/data.json');
    fs_extra_1.default.ensureFileSync(apiPath);
    const resData = fs_extra_1.default.readFileSync(apiPath);
    const injectAllCode = (data) => {
        this.top.helper.allCode = data.AssetDetails.map((item) => ({
            code: item.FundCode,
            name: item.FundName,
        }));
        callback();
    };
    if (!resData.length) {
        service_1.GetMyAssetDetails().then(data => {
            fs_extra_1.default.writeJSONSync(apiPath, data, { spaces: 2 });
            injectAllCode(data);
        });
    }
    else {
        injectAllCode(JSON.parse(resData.toString()));
    }
});
exports.default = main;
