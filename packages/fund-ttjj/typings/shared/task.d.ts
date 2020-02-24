import TaskController from './taskController';
export default class Task {
    static create(title: string): Task;
    title: string;
    _top: TaskController | null;
    cmd: Function;
    constructor(title: string);
    get top(): TaskController;
    set top(controller: TaskController);
    execute(executeFn: Function): void;
}
