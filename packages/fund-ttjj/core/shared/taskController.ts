import Task from './task';
import { Queue, logger } from '@oishi/fund-shared';
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
    const title = `「${task.title}」--- `;

    this.push((callback: Function) => {
      logger.infoBg(`${title}开始执行`);
      console.time(`${title}耗时`);
      callback();
    });

    this.push(task.cmd);

    this.push((callback: Function) => {
      logger.successBg(`${title}执行完毕`);
      console.timeEnd(`${title}耗时`);
      callback();
    });
    return this;
  }
}
