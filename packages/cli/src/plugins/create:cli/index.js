"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
const template_1 = tslib_1.__importDefault(require("./template"));
exports.default = (api) => {
    api.registerCommand({
        command: 'create:cli <name> <command>',
        description: '快速创建 cli 代码模板',
        options: [],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [name, command] = args;
        const { root, helper, logger } = ctx;
        const projectPath = path_1.default.join(root, name);
        const pkgPath = path_1.default.join(projectPath, 'package.json');
        const binPath = `bin/${name}.js`;
        helper
            .createTaskList({ hasTip: true })
            .add({
            title: '',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield execa_1.default('oishi', ['create:ts', name, '--tip'], {
                    cwd: root,
                    stdio: 'inherit',
                });
            }),
        })
            .add({
            title: 'oishi create:cli 解析参数',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const pkg = require(pkgPath);
                pkg.bin = { [name]: binPath };
                pkg.dependencies['@oishi/cli-core'] = '^0.0.33';
                yield fs_extra_1.writeJSON(pkgPath, pkg, { spaces: 2 });
            }),
        })
            .add({
            title: 'oishi create:cli 修改模板',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                template_1.default.forEach(item => {
                    if (item.type === 'bin')
                        item.path = item.path.replace(/\<\% name \%\>/g, name);
                    if (item.type === 'core')
                        item.value = item.value.replace(/\<\% command \%\>/g, command);
                });
                yield Promise.all(template_1.default.map((item) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const fileCurrPath = path_1.default.join(projectPath, item.path);
                    yield fs_extra_1.ensureFile(fileCurrPath);
                    yield fs_extra_1.writeFile(fileCurrPath, item.value);
                })));
            }),
        })
            .add({
            title: '',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const pluginsPath = path_1.default.join(projectPath, 'core', 'plugins');
                yield fs_extra_1.ensureDir(pluginsPath);
                yield execa_1.default('oishi', ['create:plg', command, '--dir', '--tip'], {
                    cwd: pluginsPath,
                    stdio: 'inherit',
                });
            }),
        })
            .add({
            title: '安装依赖',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield execa_1.default('yarn', ['install'], {
                    cwd: projectPath,
                    stdio: 'inherit',
                });
            }),
        })
            .add({
            title: '',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                console.log();
                logger.success(`🚀 cd ${name}`);
                logger.success(`🚀 node ${binPath} ${command} baby`);
                logger.success(`🚀 node ${binPath} -h`);
                logger.success(`🚀 node ${binPath} ${command} -h`);
                console.log();
            }),
        })
            .run();
    }));
};
