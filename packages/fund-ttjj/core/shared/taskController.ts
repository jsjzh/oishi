import Task from './task';

export default class TaskController {
  static create(options?: any) {
    return new TaskController(options);
  }

  cmds: Task[];
  helper: { [k: string]: any };

  constructor(options: any) {
    this.cmds = [];
    this.helper = {};
  }

  initHelper(initFn: Function) {
    this.helper = initFn();
    return this;
  }

  add(cmd: Task) {
    this.cmds.push(cmd);
    return this;
  }

  run() {
    this.cmds.forEach(cmd => cmd.excute(this.helper));
  }
}
