import logger from '../shared/logger';

interface TaskItem {
  title: string;
  task: () => Promise<any>;
}

interface TaskListConfig {
  concurrent?: boolean;
  hasTip?: boolean;
}

class TaskList {
  tasks: TaskItem[];
  options: TaskListConfig;

  constructor(options?: TaskListConfig) {
    this.tasks = [];

    this.options = {
      concurrent: false,
      hasTip: false,
      ...options,
    };
  }

  add(taskItem: TaskItem | TaskItem[]) {
    Array.isArray(taskItem)
      ? (this.tasks = this.tasks.concat(taskItem))
      : this.tasks.push(taskItem);
    return this;
  }

  async run() {
    if (this.options.concurrent) {
      await Promise.all(this.tasks.map(this._runTask.bind(this)));
    } else {
      for (const item of this.tasks) await this._runTask(item);
    }
  }

  async _runTask(taskItem: TaskItem) {
    this.options.hasTip &&
      taskItem.title &&
      logger.infoBgTip('TASK', `${taskItem.title} START`);
    await taskItem.task();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.options.hasTip &&
      taskItem.title &&
      (logger.infoBgTip('TASK', `${taskItem.title} DONE`), logger.space());
  }
}

export interface TaskListHelper {
  createTaskList: (options?: TaskListConfig) => TaskList;
}

export default {
  createTaskList(options?: TaskListConfig): TaskList {
    return new TaskList(options);
  },
};
