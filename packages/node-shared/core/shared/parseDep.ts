/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import { pathExistsSync, readFileSync, readJsonSync } from 'fs-extra';
import { execSync } from 'child_process';

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

interface ILernaPackagesInfo {
  name: string;
  version: string;
  private: boolean;
  location: string;
}

type PDependencies = {
  root: Record<string, { versions: string[] }>;
} & { [k: string]: Record<string, { versions: string[] }> };

export default class ParseDep {
  private root: string;
  private isLerna: boolean;
  private hasNpmLock: boolean;
  private hasYarnLock: boolean;

  constructor(root: string) {
    this.root = root;

    this.isLerna = pathExistsSync(this.__resolve('lerna.json'));
    this.hasNpmLock = pathExistsSync(this.__resolve('package-lock.json'));
    this.hasYarnLock = pathExistsSync(this.__resolve('yarn.lock'));

    this.__checkLockFile();
  }

  output(): PDependencies {
    let result = {
      root: {},
    };

    if (!this.hasNpmLock && !this.hasYarnLock) {
      return result;
    }

    if (this.hasNpmLock && !this.hasYarnLock) {
      const lockJson: INpmLockJson = readJsonSync(
        this.__resolve('package-lock.json'),
      );
      result.root = this.__parseNpmLock(lockJson.dependencies, result);
    }

    if (!this.hasNpmLock && this.hasYarnLock) {
      const lockJson: IYarnLockJson = yarnLockFile.parse(
        readFileSync(this.__resolve('yarn.lock'), { encoding: 'utf-8' }),
      );
      result.root = this.__parseYarnLock(lockJson.object, result);
    }

    if (this.isLerna) {
      console.info(
        'this is the lerna project that will be based on your lerna.json configuration resolution dependency information',
      );
      return this.__parseLerna(result);
    } else {
      return result;
    }
  }

  private __parseLerna(result: PDependencies) {
    const packages: ILernaPackagesInfo[] = JSON.parse(
      execSync('lerna ls --json', {
        cwd: this.root,
        stdio: 'pipe',
        encoding: 'utf8',
      }),
    );

    packages.forEach((_package) => {
      result[_package.name] = new ParseDep(_package.location).output().root;
    });

    return result;
  }

  private __parseNpmLock(obj: IDependencies, result: PDependencies) {
    Object.keys(obj).forEach((dep) => {
      const item = obj[dep];
      if (result.root[dep]) {
        if (!result.root[dep].versions.includes(item.version)) {
          result.root[dep].versions.push(item.version);
        }
      } else {
        result.root[dep] = { versions: [item.version] };
      }
      if (item.dependencies) {
        this.__parseNpmLock(item.dependencies, result);
      }
    });
    return result.root;
  }

  private __parseYarnLock(obj: IDependencies, result: PDependencies) {
    Object.keys(obj).forEach((dep) => {
      const item = obj[dep];
      const { name: depName } = parsePackageName(dep);
      if (result.root[depName]) {
        if (!result.root[depName].versions.includes(item.version)) {
          result.root[depName].versions.push(item.version);
        }
      } else {
        result.root[depName] = { versions: [item.version] };
      }
    });
    return result.root;
  }

  private __checkLockFile() {
    if (this.hasNpmLock && this.hasYarnLock) {
      console.warn(
        'both package-lock.json file and yarn.lock file exist, and package-lock.json file will be parsed',
      );
    } else if (!this.hasNpmLock && !this.hasYarnLock) {
      console.warn(
        `lock file not found, please make sure there is package-lock.json file or yarn.lock file in the ${this.root} directory`,
      );
    }
  }

  private __resolve(file: string) {
    return path.join(this.root, file);
  }
}
