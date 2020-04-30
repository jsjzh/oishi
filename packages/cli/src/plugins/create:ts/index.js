import { __awaiter } from "tslib";
import path from 'path';
import execa from 'execa';
import validateNpmPackageName from 'validate-npm-package-name';
import { ensureDir, writeFile, ensureFile } from 'fs-extra';
import templatesJson from './template';
export default (api) => {
    api.registerCommand({
        command: 'create:ts <name>',
        description: '快速创建 typescript 代码模板',
        options: [
            ['-d, --description <string>', '项目名称描述', '项目名称描述，待补充'],
            ['-v, --version <string>', '项目版本', '0.0.0'],
            ['--tip', '是否需要 tip 提示信息'],
        ],
    }, (args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const [name] = args;
        const { argv, root, helper, logger } = ctx;
        const { description, version, tip } = argv;
        const conf = {
            projectPath: path.join(root, name),
            name,
            description,
            version,
            userName: '',
            userEmail: '',
        };
        yield ensureDir(conf.projectPath);
        helper
            .createTaskList({ hasTip: !!tip })
            .add({
            title: 'oishi create:ts 获取参数',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
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
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                const { errors, validForNewPackages, warnings, } = validateNpmPackageName(conf.name);
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
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                templatesJson.forEach((item) => {
                    if (item.type === 'package') {
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
            task: () => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all(templatesJson.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const fileCurrPath = path.join(conf.projectPath, item.path);
                    yield ensureFile(fileCurrPath);
                    yield writeFile(fileCurrPath, item.value);
                })));
            }),
        })
            .add({
            title: '',
            task: () => __awaiter(void 0, void 0, void 0, function* () {
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
const getGitConfig = (props, cwd) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa('git', ['config', '--get', props], { cwd });
    return stdout ? stdout : '';
});
