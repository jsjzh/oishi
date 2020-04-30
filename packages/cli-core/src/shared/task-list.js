import { __awaiter } from "tslib";
import logger from '../shared/logger';
class TaskList {
    constructor(options) {
        this.tasks = [];
        this.options = Object.assign({ concurrent: false, hasTip: false }, options);
    }
    add(taskItem) {
        Array.isArray(taskItem)
            ? (this.tasks = this.tasks.concat(taskItem))
            : this.tasks.push(taskItem);
        return this;
    }
    _runTask(taskItem) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options.hasTip &&
                taskItem.title &&
                logger.infoBgTip('TASK', `${taskItem.title} START`);
            yield taskItem.task();
            this.options.hasTip &&
                taskItem.title &&
                logger.successBgTip('TASK', `${taskItem.title} DONE`);
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.concurrent) {
                yield Promise.all(this.tasks.map(this._runTask.bind(this)));
            }
            else {
                for (const item of this.tasks)
                    yield this._runTask(item);
            }
        });
    }
}
export default {
    createTaskList(options) {
        return new TaskList(options);
    },
};
