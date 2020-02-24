"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task_1 = tslib_1.__importDefault(require("../shared/task"));
const queue_1 = tslib_1.__importDefault(require("../shared/queue"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const service_1 = require("../service");
const main = task_1.default.create();
main.execute(function (callback) {
    const helper = this.top.helper;
    const apiPath = path_1.default.resolve(helper.dayPath, 'GetProfitList');
    const reqs = helper.allCode.map(({ code, name }) => (callback) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const codePath = path_1.default.resolve(apiPath, `${code}-${name}.json`);
        const data = yield service_1.GetProfitList({ FundCode: code });
        fs_extra_1.default.ensureFileSync(codePath);
        fs_extra_1.default.writeJSONSync(codePath, data, { spaces: 2 });
        setTimeout(() => callback(), 3000);
    }));
    const queue = new queue_1.default(reqs);
    queue.final(callback);
    queue.next();
});
exports.default = main;
