import TaskController from './taskController';
export default class Task {
    static create(options?: any): Task;
    constructor(options: any);
    inject(): void;
    excute(helper: TaskController['helper']): void;
}
