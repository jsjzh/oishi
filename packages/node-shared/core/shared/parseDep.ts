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
type ODependencies = {
  name: string;
  allDeps: Record<string, string[]>;
}[];

interface IPackageJson {
  name: string;
  version: string;
  private?: boolean;
  description?: string;
  main?: string;
}

export default class ParseDep {
  private root: string;
  private packageJson: IPackageJson;
  private isLerna: boolean;
  private hasNpmLock: boolean;
  private hasYarnLock: boolean;

  constructor(root: string) {
    this.root = root;

    this.packageJson = readJsonSync(this.__resolve('package.json'));
    this.isLerna = pathExistsSync(this.__resolve('lerna.json'));
    this.hasNpmLock = pathExistsSync(this.__resolve('package-lock.json'));
    this.hasYarnLock = pathExistsSync(this.__resolve('yarn.lock'));

    this.__checkLockFile();
  }

  packages() {
    let packagesInfo: Omit<ILernaPackagesInfo, 'location'>[] = [];

    if (this.isLerna) {
      packagesInfo = JSON.parse(
        execSync('lerna ls --json', {
          cwd: this.root,
          stdio: 'pipe',
          encoding: 'utf8',
        }),
      );

      packagesInfo = packagesInfo.map((info) => ({
        name: info.name,
        version: info.version,
        private: info.private,
      }));
    }

    return [
      {
        name: this.packageJson.name,
        version: this.packageJson.version,
        private: this.packageJson.private || false,
      },
      ...packagesInfo,
    ];
  }

  output(): ODependencies {
    let result: ODependencies = [];

    if (!this.hasNpmLock && !this.hasYarnLock) {
      return result;
    }

    let rootInfo = {
      name: this.packageJson.name,
      allDeps: {},
    };
    if (this.hasNpmLock) {
      const lockJson: INpmLockJson = readJsonSync(
        this.__resolve('package-lock.json'),
      );
      rootInfo.allDeps = this.__parseNpmLock(lockJson.dependencies);
    } else {
      const lockJson: IYarnLockJson = yarnLockFile.parse(
        readFileSync(this.__resolve('yarn.lock'), { encoding: 'utf-8' }),
      );
      rootInfo.allDeps = this.__parseYarnLock(lockJson.object);
    }

    result.push(rootInfo);

    if (this.isLerna) {
      console.info(
        'this is the lerna project that will be based on your lerna.json configuration resolution dependency information',
      );
      result = result.concat(this.__parseLerna());
    }
    return result;
  }

  private __parseLerna() {
    let result: ODependencies = [];

    const packages: ILernaPackagesInfo[] = JSON.parse(
      execSync('lerna ls --json', {
        cwd: this.root,
        stdio: 'pipe',
        encoding: 'utf8',
      }),
    );

    packages.forEach((_package) => {
      result = result.concat(new ParseDep(_package.location).output());
    });

    return result;
  }

  private __parseNpmLock(
    obj: IDependencies,
    depInfo: Record<string, string[]> = {},
  ) {
    Object.keys(obj).forEach((dep) => {
      const item = obj[dep];
      const { name: depName } = parsePackageName(dep);
      if (depInfo[depName]) {
        if (!depInfo[depName].includes(item.version)) {
          depInfo[depName].push(item.version);
        }
      } else {
        depInfo[depName] = [item.version];
      }

      if (item.dependencies) {
        this.__parseNpmLock(item.dependencies, depInfo);
      }
    });

    return depInfo;
  }

  private __parseYarnLock(obj: IDependencies) {
    const depInfo: Record<string, string[]> = {};

    Object.keys(obj).forEach((dep) => {
      const item = obj[dep];
      const { name: depName } = parsePackageName(dep);
      if (depInfo[depName]) {
        if (!depInfo[depName].includes(item.version)) {
          depInfo[depName].push(item.version);
        }
      } else {
        depInfo[depName] = [item.version];
      }
    });

    return depInfo;
  }

  private __checkLockFile() {
    if (this.hasNpmLock && this.hasYarnLock) {
      console.warn(
        'package-lock.json and yarn.lock exist both, package-lock.json file will be parsed',
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
