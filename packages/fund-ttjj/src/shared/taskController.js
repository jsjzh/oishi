"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TaskController {
    constructor(options) {
        this.cmds = [];
        this.helper = {};
    }
    static create(options) {
        return new TaskController(options);
    }
    initHelper(initFn) {
        this.helper = initFn();
        return this;
    }
    add(cmd) {
        this.cmds.push(cmd);
        return this;
    }
    run() {
        this.cmds.forEach(cmd => cmd.excute(this.helper));
    }
}
exports.default = TaskController;
