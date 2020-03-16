"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
const log_1 = tslib_1.__importDefault(require("../shared/log"));
const execa_1 = tslib_1.__importDefault(require("execa"));
const shared_1 = require("../shared");
exports.default = (api) => {
    api.registerCommand({
        command: 'bundle',
        description: 'rn 打包项目用命令脚本，需要帮助可以使用指令 -h',
        options: [
            [
                '-p, --platform <platform>',
                '设定打包平台：可选 ios 和 android',
                'ios',
            ],
            [
                '-e, --entry <filePath>',
                '设定打包入口文件路径，默认为 index.{platform}.js',
            ],
            [
                '-o, --output <filePath>',
                '设定输出文件路径，默认为 dist/index.{platform}.bundle',
            ],
            [
                '-s, --sourcemap <filePath>',
                '设定输出 sourcemap 路径，默认为 dist/index.{platform}.bundle.map',
            ],
            ['-c, --config <filePath>', '设定打包脚本路径', 'metro.config.js'],
            ['-d, --dev <boolean>', '设定为：打包 dev 环境', false],
            ['-m, --minify <boolean>', '设定为：压缩代码', true],
            ['-r, --reset-cache <boolean>', '设定为：不使用缓存', true],
        ],
    }, (args, ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { argv } = ctx;
        const { platform, entry, output, sourcemap, config, dev, minify, resetCache, } = argv;
        // platform 检测
        if (platform !== 'ios' && platform !== 'android')
            throw new Error('platform 设置错误，只能为 ios 或者 android');
        const projectPath = process.cwd();
        const curryProjectPath = shared_1.curryProjectConcatPath(projectPath);
        const reactNativeCliPath = curryProjectPath('./node_modules/react-native/local-cli/cli.js');
        if (!fs_extra_1.existsSync(reactNativeCliPath))
            throw new Error(`${reactNativeCliPath} react-native-cli 路径无效，请确保你的项目存在 node_modules`);
        const absEntryPath = entry
            ? curryProjectPath(entry)
            : curryProjectPath(`index.${platform}.js`);
        if (!fs_extra_1.existsSync(absEntryPath))
            throw new Error(`${absEntryPath} entry 路径无效`);
        const absOutputPath = output
            ? curryProjectPath(output)
            : curryProjectPath(path_1.default.join('dist', `index.${platform}.bundle`));
        const absSourcemapPath = sourcemap
            ? curryProjectPath(sourcemap)
            : curryProjectPath(path_1.default.join('dist', `index.${platform}.bundle.map`));
        const absConfigPath = config
            ? curryProjectPath(config)
            : curryProjectPath('metro.config.js');
        if (!fs_extra_1.existsSync(absConfigPath))
            throw new Error(`${absConfigPath} config 路径无效`);
        yield Promise.all([
            fs_extra_1.ensureFile(absOutputPath),
            fs_extra_1.ensureFile(absSourcemapPath),
        ]);
        const realConfigsObj = {
            '--platform': platform,
            '--entry-file': absEntryPath,
            '--bundle-output': absOutputPath,
            '--sourcemap-output': absSourcemapPath,
            '--config': absConfigPath,
            '--dev': dev,
            '--minify': minify,
            '--reset-cache': resetCache,
        };
        const realConfigsArr = Object.keys(realConfigsObj).reduce((pre, curr) => pre.concat([curr, realConfigsObj[curr]]), ['bundle']);
        log_1.default.infoBg('开始打包项目');
        log_1.default.info(`打包平台：${realConfigsObj['--platform']}`);
        log_1.default.info(`打包入口文件：${realConfigsObj['--entry-file']}`);
        log_1.default.info(`打包输出文件：${realConfigsObj['--bundle-output']}`);
        log_1.default.info(`打包输出 map：${realConfigsObj['--sourcemap-output']}`);
        log_1.default.info(`打包脚本路径：${realConfigsObj['--config']}`);
        log_1.default.info(`是否打包 dev 环境：${realConfigsObj['--dev']}`);
        log_1.default.info(`是否压缩代码：${realConfigsObj['--minify']}`);
        log_1.default.info(`是否清除缓存：${realConfigsObj['--reset-cache']}`);
        console.log();
        log_1.default.info(`打包命令执行：node ${reactNativeCliPath} ${realConfigsArr.join(' ')}`);
        try {
            (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const { stdout } = yield execa_1.default.node(reactNativeCliPath, realConfigsArr);
                log_1.default.successBg('项目打包成功');
                log_1.default.success(stdout);
            }))();
        }
        catch (error) {
            log_1.default.errorBg('项目打包出错，请重试');
            throw new Error(error);
        }
    }));
};
