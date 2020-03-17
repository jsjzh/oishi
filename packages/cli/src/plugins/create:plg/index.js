"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const template_1 = tslib_1.__importDefault(require("./template"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = (api) => {
    api.registerCommand({
        command: 'create:plg <command>',
        description: '快速创建 plugin 代码模板',
        options: [
            ['--dir', '是否要使用 {command}/index.ts 模式'],
            ['--tip', '是否需要 tip 提示信息'],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [command] = args;
        const { root, argv, helper, logger } = ctx;
        const { dir, tip } = argv;
        const pluginName = dir ? path_1.default.join(command, 'index.ts') : `${command}.ts`;
        const pluginPath = path_1.default.resolve(root, pluginName);
        let _template = '';
        helper
            .createTaskList({ hasTip: !!tip })
            .add({
            title: 'oishi create:plg 解析数据',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                _template = template_1.default
                    .replace(/\<\% command \%\>/g, command)
                    .replace(/\<\% description \%\>/g, '新建 plugin 待补充内容');
            }),
        })
            .add({
            title: 'oishi create:plg 写入数据',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield fs_extra_1.ensureFile(pluginPath);
                yield fs_extra_1.writeFile(pluginPath, _template);
            }),
        })
            .add({
            title: '',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                logger.success(`${pluginName} 注入工程完毕，现只需要在 CliCore 的实例中，添加 plugin 即可使用，使用方式为 \`<package.json 中的 bin 属性> ${command} hello-wrold\``);
            }),
        })
            .run();
    }));
};
