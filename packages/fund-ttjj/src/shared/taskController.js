"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const moment_1 = tslib_1.__importDefault(require("moment"));
class TaskController {
    constructor(options) {
        this.cmds = [];
        const time = moment_1.default();
        const outputPath = path_1.default.resolve(process.cwd(), './output/');
        const yearPath = path_1.default.resolve(outputPath, time.format('YYYY') + ' 年');
        const monthPath = path_1.default.resolve(yearPath, time.format('MM') + ' 月');
        const dayPath = path_1.default.resolve(monthPath, time.format('DD') + ' 日');
        this.helper = {
            time,
            outputPath,
            yearPath,
            monthPath,
            dayPath,
        };
    }
    static create(options) {
        return new TaskController(options);
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
