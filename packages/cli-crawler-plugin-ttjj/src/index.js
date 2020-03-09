"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shared_1 = require("./shared");
const fs_extra_1 = require("fs-extra");
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
        let { config, output } = argv;
        const curryGetRootAbsolutePath = shared_1.curryGetAbsolutePath(root);
        const [configJson] = yield Promise.all([
            fs_extra_1.readJSON(curryGetRootAbsolutePath(config)),
            fs_extra_1.ensureDir(curryGetRootAbsolutePath(output)),
        ]);
        console.log(configJson);
        helper.createTaskList({ hasTip: true }).add({
            title: '获取所有持仓基金',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        });
    }));
};
