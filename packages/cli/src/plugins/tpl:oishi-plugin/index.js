"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.default = (api) => {
    api.registerCommand({
        command: 'tpl:oishi-plugin <name>',
        description: '快速创建 oishi-plugin 代码模板',
        options: [
            ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [name] = args;
        const { helper, argv } = ctx;
    }));
};
