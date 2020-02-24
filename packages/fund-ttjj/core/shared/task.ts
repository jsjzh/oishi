import TaskController from './taskController';

export default class Task {
  static create(options?: any) {
    return new Task(options);
  }

  constructor(options: any) {
    console.log('new Task success');
  }

  inject() {}

  excute(helper: TaskController['helper']) {
    console.log(`you need override instance's method excute()`);
  }
}
