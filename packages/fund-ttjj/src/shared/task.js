"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    static create(options) {
        return new Task(options);
    }
    constructor(options) {
        console.log('new Task success');
    }
    inject() { }
    excute(helper) {
        console.log(`you need override instance's method excute()`);
    }
}
exports.default = Task;
