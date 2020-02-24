"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fund_shared_1 = require("@oishi/fund-shared");
class TaskController extends fund_shared_1.Queue {
    constructor(options) {
        super();
        this.helper = {};
    }
    static create(options) {
        return new TaskController(options);
    }
    initHelper(initFn) {
        this.helper = initFn();
        return this;
    }
    add(task) {
        task.top = this;
        this.push(task.cmd);
        return this;
    }
}
exports.default = TaskController;
