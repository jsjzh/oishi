import Task from './task';
import Queue from './queue';
export default class TaskController extends Queue {
  static create(options?: any) {
    return new TaskController(options);
  }

  helper: { [k: string]: any };

  constructor(options: any) {
    super();
    this.helper = {};
  }

  initHelper(initFn: Function) {
    this.helper = initFn();
    return this;
  }

  add(task: Task) {
    task.top = this;
    this.push(task.cmd);
    return this;
  }
}
