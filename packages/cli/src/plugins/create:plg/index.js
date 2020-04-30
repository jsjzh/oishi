import { __awaiter } from "tslib";
import { ensureFile, writeFile } from 'fs-extra';
import template from './template';
import path from 'path';
export default (api) => {
    api.registerCommand({
        command: 'create:plg <command>',
        description: '快速创建 plugin 代码模板',
        options: [
            ['--dir', '是否要使用 {command}/index.ts 模式'],
            ['--tip', '是否需要 tip 提示信息'],
        ],
    }, (args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const [command] = args;
        const { root, argv, helper, logger } = ctx;
        const { dir, tip } = argv;
        const pluginName = dir ? path.join(command, 'index.ts') : `${command}.ts`;
        const pluginPath = path.resolve(root, pluginName);
        let _template = '';
        helper
            .createTaskList({ hasTip: !!tip })
            .add({
            title: 'oishi create:plg 解析数据',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                _template = template
                    .replace(/\<\% command \%\>/g, command)
                    .replace(/\<\% description \%\>/g, '新建 plugin 待补充内容');
            }),
        })
            .add({
            title: 'oishi create:plg 写入数据',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                yield ensureFile(pluginPath);
                yield writeFile(pluginPath, _template);
            }),
        })
            .add({
            title: '',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                logger.success(`${pluginName} 注入工程完毕，现只需要在 CliCore 的实例中，添加 plugin 即可使用，使用方式为 \`<package.json 中的 bin 属性> ${command} hello-wrold\``);
            }),
        })
            .run();
    }));
};
