"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const oishi_shared_1 = require("@oishi/oishi-shared");
const shared_1 = require("./shared");
const fs_extra_1 = require("fs-extra");
const path_1 = tslib_1.__importDefault(require("path"));
const service_1 = require("./service");
exports.default = (api) => {
    api.registerCommand({
        command: 'ttjj',
        description: '爬取「天天基金」相关的数据',
        options: [
            [
                '-c, --config <path>',
                '爬虫所需 config 文件路径，绝对地址或者相对地址皆可',
                './oishi-crawler/ttjj/config.json',
            ],
            [
                '-o, --output <path>',
                '爬取到数据之后导出路径，绝对地址或者相对地址皆可',
                './oishi-crawler/ttjj/output',
            ],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { root, helper, argv } = ctx;
        const { config, output } = argv;
        const curryGetRootAbsolutePath = shared_1.curryGetAbsolutePath(root);
        const curryOutPathTimePath = shared_1.curryTimePath(output);
        const GetMyAssetDetailsPath = curryOutPathTimePath('GetMyAssetDetailsPath');
        const GetShareDetailPath = curryOutPathTimePath('GetShareDetailPath');
        const GetTransactionRecordsPath = curryOutPathTimePath('GetTransactionRecordsPath');
        const GetProfitListPath = curryOutPathTimePath('GetProfitListPath');
        const initAndCheckPathPromises = [
            fs_extra_1.readJSON(curryGetRootAbsolutePath(config)),
        ].concat([
            GetMyAssetDetailsPath,
            GetShareDetailPath,
            GetTransactionRecordsPath,
            GetProfitListPath,
        ].map((filePath) => fs_extra_1.ensureDir(filePath)));
        const [configJson] = yield Promise.all(initAndCheckPathPromises);
        const tradeapilvs5 = service_1.createService('https://tradeapilvs5.1234567.com.cn/', { handleResp: data => data.Data }, { UserId: configJson.UserId });
        const rspData = yield tradeapilvs5.GetMyAssetDetails(configJson);
        yield fs_extra_1.writeJSON(path_1.default.join(GetMyAssetDetailsPath, 'data.json'), rspData, {
            spaces: 2,
        });
        const allCode = rspData.AssetDetails.map((item) => ({
            code: item.FundCode,
            name: item.FundName,
        }));
        const sharedDetailTasks = helper.createTaskList({ hasTip: true }).add(allCode.map(({ name, code }) => {
            const codePath = shared_1.getCodePath(GetShareDetailPath, code, name);
            return {
                title: `爬取基金队列 ${code} ${name}`,
                task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const rspData = yield tradeapilvs5.GetShareDetail({
                        FundCode: code,
                    });
                    yield Promise.all([
                        fs_extra_1.ensureFile(codePath),
                        fs_extra_1.writeJSON(codePath, rspData, { spaces: 2 }),
                    ]);
                    return shared_1.sleep(3);
                }),
            };
        }));
        const transactionRecordsTasks = helper
            .createTaskList({ hasTip: true })
            .add(allCode.map(({ name, code }) => {
            const codePath = shared_1.getCodePath(GetTransactionRecordsPath, code, name);
            return {
                title: `爬取操作记录 ${code} ${name}`,
                task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const rspData = yield tradeapilvs5.GetTransactionRecords({
                        FundCode: code,
                    });
                    yield Promise.all([
                        fs_extra_1.ensureFile(codePath),
                        fs_extra_1.writeJSON(codePath, rspData, { spaces: 2 }),
                    ]);
                    return shared_1.sleep(3);
                }),
            };
        }));
        const profitListTasks = helper.createTaskList({ hasTip: true }).add(allCode.map(({ name, code }) => {
            const codePath = shared_1.getCodePath(GetProfitListPath, code, name);
            return {
                title: `爬取基金队列 ${code} ${name}`,
                task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const rspData = yield tradeapilvs5.GetProfitList({
                        FundCode: code,
                    });
                    yield Promise.all([
                        fs_extra_1.ensureFile(codePath),
                        fs_extra_1.writeJSON(codePath, rspData, { spaces: 2 }),
                    ]);
                    return shared_1.sleep(3);
                }),
            };
        }));
        const queue = new oishi_shared_1.Queue();
        queue
            .push((next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield sharedDetailTasks.run();
            next();
        }))
            .push((next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield transactionRecordsTasks.run();
            next();
        }))
            .push((next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield profitListTasks.run();
            next();
        }))
            .next();
    }));
};
