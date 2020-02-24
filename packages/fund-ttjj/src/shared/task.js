"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const taskController_1 = tslib_1.__importDefault(require("./taskController"));
class Task {
    constructor(title) {
        this._top = null;
        this.title = title;
        this.cmd = () => { };
    }
    static create(title) {
        return new Task(title);
    }
    get top() {
        return this._top instanceof taskController_1.default
            ? this._top
            : new taskController_1.default({});
    }
    set top(controller) {
        this._top = controller;
    }
    execute(executeFn) {
        this.cmd = executeFn.bind(this);
    }
}
exports.default = Task;
