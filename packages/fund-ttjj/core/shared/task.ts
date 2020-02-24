import TaskController from './taskController';

export default class Task {
  static create(options?: any) {
    return new Task(options);
  }

  _top: TaskController | null;
  cmd: Function;

  constructor(options: any) {
    this._top = null;
    this.cmd = () => {};
  }

  get top(): TaskController {
    return this._top instanceof TaskController
      ? this._top
      : new TaskController({});
  }

  set top(controller: TaskController) {
    this._top = controller;
  }

  execute(executeFn: Function) {
    this.cmd = executeFn.bind(this);
  }
}
