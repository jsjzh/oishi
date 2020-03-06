"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("./logger"));
class TaskList {
    constructor(options) {
        this.tasks = [];
        this.options = Object.assign({ concurrent: false, hasTip: false }, options);
    }
    add(taskItem) {
        this.tasks.push(taskItem);
        return this;
    }
    _runTask(taskItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.options.hasTip &&
                taskItem.title &&
                logger_1.default.infoBgTip('TASK', `${taskItem.title} START`);
            yield taskItem.task();
            this.options.hasTip &&
                taskItem.title &&
                logger_1.default.successBgTip('TASK', `${taskItem.title} DONE`);
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
exports.default = {
    createTaskList(options) {
        return new TaskList(options);
    },
};
