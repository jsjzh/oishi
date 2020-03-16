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
        command: 'tpl:ts <name>',
        description: '快速创建 typescript 代码模板',
        options: [
            ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
            ['-v, --version <string>', '项目版本', '0.0.0'],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const [name] = args;
        const { argv, root, helper, logger } = ctx;
        const { description, version } = argv;
        const conf = {
            root: path_1.default.join(root, name),
            name,
            description,
            version,
        };
        helper
            .createTaskList({ hasTip: true })
            .add({
            title: '验证 name 是否符合规范',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const { errors, validForNewPackages, warnings, } = validate_npm_package_name_1.default(conf.name);
                if (!validForNewPackages) {
                    logger.error('name 错误');
                    if (errors)
                        throw new Error(errors.join(' '));
                    if (warnings)
                        throw new Error(warnings.join(' '));
                }
            }),
        })
            .add({
            title: '创建项目目录',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield fs_extra_1.ensureDir(conf.root);
            }),
        })
            .add({
            title: '获取 git config 信息',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const [userName, userEmail] = yield Promise.all([
                    getGitConfig('user.name', conf.root),
                    getGitConfig('user.email', conf.root),
                ]);
                conf.userName = userName;
                conf.userEmail = userEmail;
            }),
        })
            .add({
            title: '修改模板信息',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                template_1.default.forEach(item => {
                    if (item.path === 'package.json') {
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
            title: '生成对应工程文件',
            task: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const promises = template_1.default.map((item) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    yield fs_extra_1.ensureFile(path_1.default.resolve(conf.root, item.path));
                    yield fs_extra_1.writeFile(path_1.default.resolve(conf.root, item.path), item.value);
                }));
                yield Promise.all(promises);
            }),
        })
            .run();
    }));
};
const getGitConfig = (props, cwd) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa_1.default('git', ['config', '--get', props], { cwd });
    return stdout;
});
