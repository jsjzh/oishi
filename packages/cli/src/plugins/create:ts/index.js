"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const execa_1 = tslib_1.__importDefault(require("execa"));
const validate_npm_package_name_1 = tslib_1.__importDefault(require("validate-npm-package-name"));
const fs_extra_1 = require("fs-extra");
const template_1 = tslib_1.__importDefault(require("./template"));
exports.default = (api) => {
    api.registerCommand({
        command: 'create:ts <name>',
        description: '快速创建 typescript 代码模板',
        options: [
            ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
            ['-v, --version <string>', '项目版本', '0.0.0'],
            ['--tip', '是否需要 tip 提示信息'],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [name] = args;
        const { argv, root, helper, logger } = ctx;
        const { description, version, tip } = argv;
        const conf = {
            projectPath: path_1.default.join(root, name),
            name,
            description,
            version,
            userName: '',
            userEmail: '',
        };
        yield fs_extra_1.ensureDir(conf.projectPath);
        helper
            .createTaskList({ hasTip: !!tip })
            .add({
            title: 'oishi create:ts 获取参数',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const [userName, userEmail] = yield Promise.all([
                    getGitConfig('user.name', conf.projectPath),
                    getGitConfig('user.email', conf.projectPath),
                ]);
                conf.userName = userName;
                conf.userEmail = userEmail;
            }),
        })
            .add({
            title: 'oishi create:ts 验证参数',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const { errors, validForNewPackages, warnings, } = validate_npm_package_name_1.default(conf.name);
                if (!validForNewPackages) {
                    if (errors)
                        throw new Error(`输入的 name 不合规：${errors.join(' ')}`);
                    if (warnings)
                        throw new Error(`输入的 name 不合规：${warnings.join(' ')}`);
                }
                if (!conf.userName) {
                    logger.info('无法获取到 git user.name');
                }
                if (!conf.userEmail) {
                    logger.info('无法获取到 git user.email');
                }
            }),
        })
            .add({
            title: 'oishi create:ts 修改模板',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                template_1.default.forEach(item => {
                    if (item.type === 'package') {
                        // 这里其实可以改成 replace(RegExp, callback) 类型的
                        // 不过为了方便修改，还是先不这么搞
                        item.value = item.value
                            .replace(/\<\% name \%\>/g, conf.name)
                            .replace(/\<\% version \%\>/g, conf.version)
                            .replace(/\<\% description \%\>/g, conf.description)
                            .replace(/\<\% author \%\>/g, `${conf.userName} <${conf.userEmail}>`);
                    }
                });
            }),
        })
            .add({
            title: 'oishi create:ts 生成项目',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all(template_1.default.map((item) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const fileCurrPath = path_1.default.join(conf.projectPath, item.path);
                    yield fs_extra_1.ensureFile(fileCurrPath);
                    yield fs_extra_1.writeFile(fileCurrPath, item.value);
                })));
            }),
        })
            .add({
            title: '',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                console.log();
                logger.success(`🚀 cd ${conf.name}`);
                logger.success(`🚀 yarn`);
                logger.success(`🚀 node src/index.js`);
                console.log();
            }),
        })
            .run();
    }));
};
const getGitConfig = (props, cwd) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa_1.default('git', ['config', '--get', props], { cwd });
    return stdout ? stdout : '';
});
