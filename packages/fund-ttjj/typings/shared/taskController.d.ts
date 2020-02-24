import Task from './task';
import { Queue } from '@oishi/fund-shared';
export default class TaskController extends Queue {
    static create(options?: any): TaskController;
    helper: {
        [k: string]: any;
    };
    constructor(options: any);
    initHelper(initFn: Function): this;
    add(task: Task): this;
}
