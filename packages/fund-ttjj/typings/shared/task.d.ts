import TaskController from './taskController';
export default class Task {
    static create(options?: any): Task;
    _top: TaskController | null;
    cmd: Function;
    constructor(options: any);
    get top(): TaskController;
    set top(controller: TaskController);
    execute(executeFn: Function): void;
}
