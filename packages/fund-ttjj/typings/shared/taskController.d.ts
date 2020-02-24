import Task from './task';
export default class TaskController {
    static create(options?: any): TaskController;
    cmds: Task[];
    helper: {
        [k: string]: any;
    };
    constructor(options: any);
    initHelper(initFn: Function): this;
    add(cmd: Task): this;
    run(): void;
}
