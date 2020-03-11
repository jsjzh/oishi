"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.default = (api) => {
    api.registerCommand({
        command: 'hello <use-name>',
        description: '小任务系列一，hello username',
        options: [],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [userName] = args;
        console.log(userName);
    }));
};
