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
        const title = `「${task.title}」--- `;
        this.push((callback) => {
            fund_shared_1.log.infoBg(`${title}开始执行`);
            console.time(`${title}耗时`);
            callback();
        });
        this.push(task.cmd);
        this.push((callback) => {
            fund_shared_1.log.successBg(`${title}执行完毕`);
            console.timeEnd(`${title}耗时`);
            callback();
        });
        return this;
    }
}
exports.default = TaskController;
