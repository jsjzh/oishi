import path from 'path';
import { writeFileSync, ensureFile } from 'fs-extra';
import minimist from 'minimist';

// import debounce from 'lodash.debounce';

interface IModuleInfo {
  id: number;
  path: string;
}

export default class BundleBaseStore {
  entry: string;
  target: 'ios' | 'android';

  paths: {
    projectPath: string;
    bundleToolsPath: string;
    baseModuleMapPath: string;
  };
  baseModuleId: number;
  baseModuleMap: IModuleInfo[];

  constructor() {
    const { platform } = minimist(process.argv);
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
    const bundleToolsPath = path.resolve(__dirname, '../../../../../../');
    const baseModuleMapPath = path.resolve(
      bundleToolsPath,
      `./config/baseModuleMap.${this.target}.json`,
    );

    this.paths = {
      projectPath,
      bundleToolsPath,
      baseModuleMapPath,
    };
  }

  async createEmptyConfigMap() {
    await ensureFile(this.paths.baseModuleMapPath);
  }

  saveModuleMap() {
    writeFileSync(
      this.paths.baseModuleMapPath,
      JSON.stringify(this.baseModuleMap),
    );
  }

  pathToModuleId(modulePath: string): number {
    let relativePath = modulePath.slice(this.paths.projectPath.length + 1);

    let realPath = relativePath.startsWith('node_modules')
      ? relativePath
      : `${path.join('$_jarvis_placeholder_$', relativePath)}`;

    let existModule = this.baseModuleMap.find(
      moduleInfo => moduleInfo.path === realPath,
    );

    if (existModule) {
      return existModule.id;
    } else {
      this.baseModuleId++;
      this.baseModuleMap.push({ id: this.baseModuleId, path: realPath });
      // TODO fs 读写是个费时的操作
      // 想办法把这个操作整合到一起，最后操作一次
      // 发现 debounce 无法使用
      // debounce(this.saveModuleMap, 0);
      writeFileSync(
        this.paths.baseModuleMapPath,
        JSON.stringify(this.baseModuleMap),
      );

      return this.baseModuleId;
    }
  }

  createModuleIdFactory(): (path: string) => number {
    return this.pathToModuleId.bind(this);
  }
}
