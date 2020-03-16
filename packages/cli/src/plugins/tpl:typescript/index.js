"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const helper_1 = tslib_1.__importDefault(require("./shared/helper"));
const npm_1 = tslib_1.__importDefault(require("./shared/npm"));
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
        const { argv, root } = ctx;
        const { description, version } = argv;
        const helper = new helper_1.default(ctx);
        const warn = helper.validatePkgName(name);
        if (warn)
            throw new Error(warn);
        const userName = yield helper.getGitConfig('user.name');
        const userEmail = yield helper.getGitConfig('user.email');
        const author = `${userName} ${userEmail}`;
        yield helper.copyTempToCwd(path_1.default.resolve(__dirname, './template'));
        const npmManager = new npm_1.default(path_1.default.resolve(root, './package.json'));
        npmManager
            .setProps('author', author)
            .setProps('name', name)
            .setProps('description', description)
            .setProps('version', version)
            .rewrite();
    }));
};
