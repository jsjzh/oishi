import { __awaiter } from "tslib";
import execa from 'execa';
import path from 'path';
import { writeJSON, ensureFile, writeFile, ensureDir } from 'fs-extra';
import templatesJson from './template';
export default (api) => {
    api.registerCommand({
        command: 'create:cli <name> <command>',
        description: '快速创建 cli 代码模板',
        options: [],
    }, (args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const [name, command] = args;
        const { root, helper, logger } = ctx;
        const projectPath = path.join(root, name);
        const pkgPath = path.join(projectPath, 'package.json');
        const binPath = `bin/${name}.js`;
        helper
            .createTaskList({ hasTip: true })
            .add({
            title: '',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                yield execa('oishi', ['create:ts', name, '--tip'], {
                    cwd: root,
                    stdio: 'inherit',
                });
            }),
        })
            .add({
            title: 'oishi create:cli 解析参数',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                const pkg = require(pkgPath);
                pkg.bin = { [name]: binPath };
                pkg.dependencies['@oishi/cli-core'] = '^0.0.33';
                yield writeJSON(pkgPath, pkg, { spaces: 2 });
            }),
        })
            .add({
            title: 'oishi create:cli 修改模板',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                templatesJson.forEach((item) => {
                    if (item.type === 'bin')
                        item.path = item.path.replace(/\<\% name \%\>/g, name);
                    if (item.type === 'core')
                        item.value = item.value.replace(/\<\% command \%\>/g, command);
                });
                yield Promise.all(templatesJson.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const fileCurrPath = path.join(projectPath, item.path);
                    yield ensureFile(fileCurrPath);
                    yield writeFile(fileCurrPath, item.value);
                })));
            }),
        })
            .add({
            title: '',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                const pluginsPath = path.join(projectPath, 'core', 'plugins');
                yield ensureDir(pluginsPath);
                yield execa('oishi', ['create:plg', command, '--dir', '--tip'], {
                    cwd: pluginsPath,
                    stdio: 'inherit',
                });
            }),
        })
            .add({
            title: '安装依赖',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                yield execa('yarn', ['install'], {
                    cwd: projectPath,
                    stdio: 'inherit',
                });
            }),
        })
            .add({
            title: '',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
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
