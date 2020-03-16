import path from 'path';
import { writeFileSync, ensureFile } from 'fs-extra';
import minimist from 'minimist';

// import debounce from 'lodash.debounce';

interface IModuleInfo {
  id: number;
  path: string;
}

export default class BundleBusinessStore {
  entry: string;
  target: 'ios' | 'android';

  paths: {
    projectPath: string;
    bundleToolsPath: string;
    businessModuleMapPath: string;
  };
  businessModuleId: number;
  baseModuleMap: IModuleInfo[];
  businessModuleMap: IModuleInfo[];

  constructor() {
    const { platform } = minimist(process.argv);
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
    const bundleToolsPath = path.resolve(
      projectPath,
      './node_modules/@jarvis/cli-bundle',
    );
    const businessModuleMapPath = path.resolve(
      projectPath,
      `./config/jarvis/businessModuleMap.${this.target}.json`,
    );

    this.paths = {
      projectPath,
      bundleToolsPath,
      businessModuleMapPath,
    };
  }

  async createEmptyConfigMap() {
    await ensureFile(this.paths.businessModuleMapPath);
  }

  cacheConfigModuleMap() {
    // 获取 target 对应的 baseModuleMap
    // eslint-disable-next-line
    this.baseModuleMap = require(path.resolve(
      this.paths.bundleToolsPath,
      `./config/baseModuleMap.${this.target}.json`,
    ));
  }

  pathToModuleId(modulePath: string): number {
    let relativePath = modulePath.slice(this.paths.projectPath.length + 1);

    let realPath = relativePath.startsWith('node_modules')
      ? relativePath
      : `${path.join('$_jarvis_placeholder_$', relativePath)}`;

    let existBaseModule = this.baseModuleMap.find(
      moduleInfo => moduleInfo.path === realPath,
    );

    // 如果找到 base 中的模块，则返回 base 中模块的 id
    if (existBaseModule) {
      return existBaseModule.id;
    } else {
      let existBusinessModule = this.businessModuleMap.find(
        moduleInfo => moduleInfo.path === realPath,
      );

      if (existBusinessModule) {
        return existBusinessModule.id;
      } else {
        this.businessModuleId++;
        this.businessModuleMap.push({
          id: this.businessModuleId,
          path: realPath,
        });
        // TODO fs 读写是个费时的操作
        // 想办法把这个操作整合到一起，最后操作一次
        // 发现 debounce 无法使用
        // debounce(this.saveModuleMap, 0);
        writeFileSync(
          this.paths.businessModuleMapPath,
          JSON.stringify(this.businessModuleMap),
        );

        return this.businessModuleId;
      }
    }
  }

  createModuleIdFactory(): (path: string) => number {
    return this.pathToModuleId.bind(this);
  }

  processModuleFilter(module: any): boolean {
    const modulePath = module['path'];
    if (
      modulePath.indexOf('__prelude__') >= 0 ||
      modulePath.indexOf('/node_modules/react-native/Libraries/polyfills') >=
        0 ||
      modulePath.indexOf('source-map') >= 0 ||
      modulePath.indexOf('/node_modules/metro/src/lib/polyfills/') >= 0
    ) {
      return false;
    }
    // let relativePath = modulePath.slice(this.paths.projectPath.length + 1);
    if (
      'js' + path.sep + 'script' + path.sep + 'virtual' ===
      module['output'][0]['type']
    ) {
      return true;
    }
    const id = this.pathToModuleId(module.path);
    if (id < 100000) return false;
    return true;
  }

  getModulesRunBeforeMainModule() {
    return [];
  }
}
