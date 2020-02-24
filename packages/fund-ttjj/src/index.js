"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const taskController_1 = tslib_1.__importDefault(require("./shared/taskController"));
const tasks_1 = require("./tasks");
// 如果异步给 helper 赋值就会出问题，后面的获取不到数据，是否要改造 rxjs 来实现
// 是否需要一个来限制并发的方法，一下子发起太多请求，容易被封
// 是否要使用 inject 来实现数据传递，现在的方式是直接在 excute 中传入的
taskController_1.default.create()
    .add(tasks_1.getAllCode)
    .add(tasks_1.getCodeDetail)
    .run();
