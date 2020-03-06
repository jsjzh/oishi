interface TaskItem {
    title: string;
    task: () => Promise<any>;
}
interface TaskListConfig {
    concurrent?: boolean;
    hasTip?: boolean;
}
declare class TaskList {
    tasks: TaskItem[];
    options: TaskListConfig;
    constructor(options?: TaskListConfig);
    add(taskItem: TaskItem): this;
    _runTask(taskItem: TaskItem): Promise<void>;
    run(): Promise<void>;
}
export interface TaskListHelper {
    createTaskList: (options?: TaskListConfig) => TaskList;
}
declare const _default: {
    createTaskList(options?: TaskListConfig | undefined): TaskList;
};
export default _default;
