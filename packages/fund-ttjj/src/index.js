"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const taskController_1 = tslib_1.__importDefault(require("./shared/taskController"));
const tasks_1 = require("./tasks");
const getData = () => {
    const time = moment_1.default();
    const outputPath = path_1.default.resolve(process.cwd(), './output/');
    const yearPath = path_1.default.resolve(outputPath, time.format('YYYY') + ' 年');
    const monthPath = path_1.default.resolve(yearPath, time.format('MM') + ' 月');
    const dayPath = path_1.default.resolve(monthPath, time.format('DD') + ' 日');
    const getDataWork = taskController_1.default.create();
    getDataWork
        .initHelper(() => ({ time, outputPath, yearPath, monthPath, dayPath }))
        .add(tasks_1.getAllCode)
        .add(tasks_1.getCodeDetail)
        .add(tasks_1.getProfitList)
        .add(tasks_1.getTransactionRecords)
        .next();
};
const resolveData = () => {
    const outputPath = path_1.default.resolve(process.cwd(), './output/');
    const resolveDataWork = taskController_1.default.create();
    resolveDataWork
        .add(tasks_1.resolveFund)
        .initHelper(() => ({ outputPath }))
        .next();
};
resolveData();
