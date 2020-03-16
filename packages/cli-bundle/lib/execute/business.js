"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
const minimist_1 = tslib_1.__importDefault(require("minimist"));
class BundleBusinessStore {
    constructor() {
        const { platform } = minimist_1.default(process.argv);
        this.entry = '';
        this.target = platform;
        this.businessModuleId = 100000;
        this.baseModuleMap = [];
        this.businessModuleMap = [];
        this.paths = {
            projectPath: '',
            bundleToolsPath: '',
            businessModuleMapPath: '',
        };
        this.resolvePath();
        this.cacheConfigModuleMap();
        this.createEmptyConfigMap();
    }
    resolvePath() {
        const projectPath = process.cwd();
        const bundleToolsPath = path_1.default.resolve(projectPath, './node_modules/@jarvis/cli-bundle');
        const businessModuleMapPath = path_1.default.resolve(projectPath, `./config/jarvis/businessModuleMap.${this.target}.json`);
        this.paths = {
            projectPath,
            bundleToolsPath,
            businessModuleMapPath,
        };
    }
    createEmptyConfigMap() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.ensureFile(this.paths.businessModuleMapPath);
        });
    }
    cacheConfigModuleMap() {
        // 获取 target 对应的 baseModuleMap
        // eslint-disable-next-line
        this.baseModuleMap = require(path_1.default.resolve(this.paths.bundleToolsPath, `./config/baseModuleMap.${this.target}.json`));
    }
    pathToModuleId(modulePath) {
        let relativePath = modulePath.slice(this.paths.projectPath.length + 1);
        let realPath = relativePath.startsWith('node_modules')
            ? relativePath
            : `${path_1.default.join('$_jarvis_placeholder_$', relativePath)}`;
        let existBaseModule = this.baseModuleMap.find(moduleInfo => moduleInfo.path === realPath);
        // 如果找到 base 中的模块，则返回 base 中模块的 id
        if (existBaseModule) {
            return existBaseModule.id;
        }
        else {
            let existBusinessModule = this.businessModuleMap.find(moduleInfo => moduleInfo.path === realPath);
            if (existBusinessModule) {
                return existBusinessModule.id;
            }
            else {
                this.businessModuleId++;
                this.businessModuleMap.push({
                    id: this.businessModuleId,
                    path: realPath,
                });
                // TODO fs 读写是个费时的操作
                // 想办法把这个操作整合到一起，最后操作一次
                // 发现 debounce 无法使用
                // debounce(this.saveModuleMap, 0);
                fs_extra_1.writeFileSync(this.paths.businessModuleMapPath, JSON.stringify(this.businessModuleMap));
                return this.businessModuleId;
            }
        }
    }
    createModuleIdFactory() {
        return this.pathToModuleId.bind(this);
    }
    processModuleFilter(module) {
        const modulePath = module['path'];
        if (modulePath.indexOf('__prelude__') >= 0 ||
            modulePath.indexOf('/node_modules/react-native/Libraries/polyfills') >=
                0 ||
            modulePath.indexOf('source-map') >= 0 ||
            modulePath.indexOf('/node_modules/metro/src/lib/polyfills/') >= 0) {
            return false;
        }
        // let relativePath = modulePath.slice(this.paths.projectPath.length + 1);
        if ('js' + path_1.default.sep + 'script' + path_1.default.sep + 'virtual' ===
            module['output'][0]['type']) {
            return true;
        }
        const id = this.pathToModuleId(module.path);
        if (id < 100000)
            return false;
        return true;
    }
    getModulesRunBeforeMainModule() {
        return [];
    }
}
exports.default = BundleBusinessStore;
