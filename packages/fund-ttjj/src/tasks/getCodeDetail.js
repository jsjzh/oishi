"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task_1 = tslib_1.__importDefault(require("../shared/task"));
const fund_shared_1 = require("@oishi/fund-shared");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const service_1 = require("../service");
const main = task_1.default.create();
main.execute(function (callback) {
    const helper = this.top.helper;
    const apiPath = path_1.default.resolve(helper.dayPath, 'GetShareDetail');
    const reqs = helper.allCode.map(({ code, name }) => (callback) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const codePath = path_1.default.resolve(apiPath, `${code}-${name}.json`);
        const data = yield service_1.GetShareDetail({ FundCode: code });
        fs_extra_1.default.ensureFileSync(codePath);
        fs_extra_1.default.writeJSONSync(codePath, data, { spaces: 2 });
        setTimeout(() => callback(), 3000);
    }));
    const queue = new fund_shared_1.Queue(reqs);
    queue.final(callback);
    queue.next();
});
exports.default = main;
