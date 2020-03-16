"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
const minimist_1 = tslib_1.__importDefault(require("minimist"));
class BundleBaseStore {
    constructor() {
        const { platform } = minimist_1.default(process.argv);
        this.entry = '';
        this.target = platform;
        this.baseModuleId = -1;
        this.baseModuleMap = [];
        this.paths = {
            projectPath: '',
            bundleToolsPath: '',
            baseModuleMapPath: '',
        };
        this.resolvePath();
        this.createEmptyConfigMap();
    }
    resolvePath() {
        const projectPath = process.cwd();
        // TODO 这里只针对 clu-unpack/bundle 文件的打包，所以有多层处理，直到 cli-unpack 的目录下
        // 在打业务包的时候是另外的一种处理
        const bundleToolsPath = path_1.default.resolve(__dirname, '../../../../../../');
        const baseModuleMapPath = path_1.default.resolve(bundleToolsPath, `./config/baseModuleMap.${this.target}.json`);
        this.paths = {
            projectPath,
            bundleToolsPath,
            baseModuleMapPath,
        };
    }
    createEmptyConfigMap() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.ensureFile(this.paths.baseModuleMapPath);
        });
    }
    saveModuleMap() {
        fs_extra_1.writeFileSync(this.paths.baseModuleMapPath, JSON.stringify(this.baseModuleMap));
    }
    pathToModuleId(modulePath) {
        let relativePath = modulePath.slice(this.paths.projectPath.length + 1);
        let realPath = relativePath.startsWith('node_modules')
            ? relativePath
            : `${path_1.default.join('$_jarvis_placeholder_$', relativePath)}`;
        let existModule = this.baseModuleMap.find(moduleInfo => moduleInfo.path === realPath);
        if (existModule) {
            return existModule.id;
        }
        else {
            this.baseModuleId++;
            this.baseModuleMap.push({ id: this.baseModuleId, path: realPath });
            // TODO fs 读写是个费时的操作
            // 想办法把这个操作整合到一起，最后操作一次
            // 发现 debounce 无法使用
            // debounce(this.saveModuleMap, 0);
            fs_extra_1.writeFileSync(this.paths.baseModuleMapPath, JSON.stringify(this.baseModuleMap));
            return this.baseModuleId;
        }
    }
    createModuleIdFactory() {
        return this.pathToModuleId.bind(this);
    }
}
exports.default = BundleBaseStore;
