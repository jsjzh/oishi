import Task from './task';

import path from 'path';
import moment from 'moment';

export default class TaskController {
  static create(options?: any) {
    return new TaskController(options);
  }

  cmds: Task[];
  helper: { [k: string]: any };

  constructor(options: any) {
    this.cmds = [];

    const time = moment();

    const outputPath = path.resolve(process.cwd(), './output/');
    const yearPath = path.resolve(outputPath, time.format('YYYY') + ' 年');
    const monthPath = path.resolve(yearPath, time.format('MM') + ' 月');
    const dayPath = path.resolve(monthPath, time.format('DD') + ' 日');

    this.helper = {
      time,
      outputPath,
      yearPath,
      monthPath,
      dayPath,
    };
  }

  add(cmd: Task) {
    this.cmds.push(cmd);
    return this;
  }

  run() {
    this.cmds.forEach(cmd => cmd.excute(this.helper));
  }
}
