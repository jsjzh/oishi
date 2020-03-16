"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const template_1 = tslib_1.__importDefault(require("./template"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = (api) => {
    api.registerCommand({
        command: 'tpl:oishi-plg <command>',
        description: '快速创建 oishi-plugin 代码模板',
        options: [
            ['-d, --description <string>', 'plugin 描述', 'plugin 描述，待补充'],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [command] = args;
        const { root, argv, helper, logger } = ctx;
        const { description } = argv;
        const pluginName = `oishi-plugin-${command}.ts`;
        const pluginPath = path_1.default.resolve(root, pluginName);
        let _template = '';
        helper
            .createTaskList({ hasTip: true })
            .add({
            title: '解析传入数据，修改模板信息',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                _template = template_1.default
                    .replace('<% command %>', command)
                    .replace('<% description %>', description);
            }),
        })
            .add({
            title: '装载并写入 plugin',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield fs_extra_1.ensureFile(pluginPath);
                yield fs_extra_1.writeFile(pluginPath, _template);
            }),
        })
            .add({
            title: '',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                logger.successBg(`${pluginName} 装载完毕，现只需要在 CliCore 的实例中，添加 plugin 即可使用，使用方式为 \`<package.json 中的 bin 属性> ${command} hello\``);
            }),
        })
            .run();
    }));
};
