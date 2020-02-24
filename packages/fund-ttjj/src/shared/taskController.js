"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const queue_1 = tslib_1.__importDefault(require("./queue"));
class TaskController extends queue_1.default {
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
