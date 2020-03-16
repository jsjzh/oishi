import { DynamicObject } from '../template/global';
import { writeJSON } from 'fs-extra';

export interface NpmConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  main: string;
  types: string;
  files: string[];
  scripts: DynamicObject;
}

export default class NpmManager {
  from: string;
  pkgTpl: NpmConfig;

  constructor(from: string) {
    this.from = from;
    this.pkgTpl = require(from);
  }

  setProps(props: keyof NpmConfig, value: any): NpmManager {
    this.pkgTpl[props] = value;
    return this;
  }

  async rewrite() {
    await writeJSON(this.from, this.pkgTpl);
  }
}
