import TaskController from './taskController';

export default class Task {
  static create(title: string) {
    return new Task(title);
  }

  title: string;
  _top: TaskController | null;
  cmd: Function;

  constructor(title: string) {
    this._top = null;
    this.title = title;
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
