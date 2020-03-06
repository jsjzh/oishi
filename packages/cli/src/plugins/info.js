"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const envinfo_1 = tslib_1.__importDefault(require("envinfo"));
exports.default = (api) => {
    api.registerCommand({
        command: 'info',
        description: 'print information about your environment',
        options: [],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { helper } = ctx;
        helper
            .createTaskList({ hasTip: true })
            .add({
            title: 'print information about your environment',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                envinfo_1.default
                    .run({}, {
                    showNotFound: true,
                    duplicates: true,
                    fullTree: true,
                })
                    .then(console.log);
            }),
        })
            .run();
    }));
};
