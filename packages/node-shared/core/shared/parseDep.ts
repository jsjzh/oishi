/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import { pathExistsSync, readFileSync, readJsonSync } from 'fs-extra';
const yarnLockFile = require('@yarnpkg/lockfile');
const parsePackageName = require('parse-package-name');

type IDependencies = Record<
  string,
  {
    version: string;
    resolved: string;
    integrity: string;
    requires?: Record<string, string>;
    dependencies?: IDependencies;
  }
>;

interface INpmLockJson {
  name: string;
  version: string;
  lockfileVersion: number;
  requires: boolean;
  dependencies: IDependencies;
}

interface IYarnLockJson {
  type: string;
  object: IDependencies;
}

type PDependencies = Record<string, { versions: string[] }>;

export default class ParseDep {
  private root: string;
  private hasNpmLock: boolean;
  private hasYarnLock: boolean;

  constructor(root: string) {
    this.root = root;

    this.hasNpmLock = pathExistsSync(this.__resolve('package-lock.json'));
    this.hasYarnLock = pathExistsSync(this.__resolve('yarn.lock'));
    this.__checkLockFile();
  }

  output() {
    if (this.hasNpmLock) {
      const lockJson: INpmLockJson = readJsonSync(
        this.__resolve('package-lock.json'),
      );
      return this.__parseNpmLock(lockJson.dependencies, {});
    } else {
      const lockJson: IYarnLockJson = yarnLockFile.parse(
        readFileSync(this.__resolve('yarn.lock'), { encoding: 'utf-8' }),
      );
      return this.__parseYarnLock(lockJson.object, {});
    }
  }

  private __parseNpmLock(obj: IDependencies, result: PDependencies) {
    Object.keys(obj).forEach((dep) => {
      const item = obj[dep];
      if (result[dep]) {
        if (!result[dep].versions.includes(item.version)) {
          result[dep].versions.push(item.version);
        }
      } else {
        result[dep] = { versions: [item.version] };
      }
      if (item.dependencies) {
        this.__parseNpmLock(item.dependencies, result);
      }
    });
    return result;
  }

  private __parseYarnLock(obj: IDependencies, result: PDependencies) {
    Object.keys(obj).forEach((dep) => {
      const item = obj[dep];
      const { name: depName } = parsePackageName(dep);
      if (result[depName]) {
        if (!result[depName].versions.includes(item.version)) {
          result[depName].versions.push(item.version);
        }
      } else {
        result[depName] = { versions: [item.version] };
      }
    });
    return result;
  }

  private __checkLockFile() {
    if (this.hasNpmLock && this.hasYarnLock) {
      console.warn(
        'both package-lock.json file and yarn.lock file exist, and package-lock.json file will be parsed',
      );
    } else if (!this.hasNpmLock && !this.hasYarnLock) {
      throw new Error(
        'lock file not found, please make sure there is package-lock.json file or yarn.lock file in the root directory',
      );
    }
  }

  private __resolve(file: string) {
    return path.join(this.root, file);
  }
}
