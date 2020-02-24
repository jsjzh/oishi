"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const taskController_1 = tslib_1.__importDefault(require("./shared/taskController"));
const tasks_1 = require("./tasks");
// 如果异步给 helper 赋值就会出问题，后面的获取不到数据，是否要改造 rxjs 来实现
//  要实现一个类，因为其实所有的代码都是有一层层逻辑的，而且是一步步执行的
//  想实现的类为可以同步也可以异步，来实现一步步进行的代码，一步步进行等于前一个执行完毕之后才会调用第二个
//    关于这个又想到了一点，既然这个可以实现一步步调用，那么关于限制并发，是不是也可以通过这个实现？
//    有可能这种方式只能实现单个请求慢慢发送，不过至少能够实现限制并发
//  并且增加一个 controller.storage 用来专门存储每个步骤获取到的 data
//  关于这个可以画一下设想图，需要什么功能
// 是否需要一个来限制并发的方法，一下子发起太多请求，容易被封
// 是否要使用 inject 来实现数据传递，现在的方式是直接在 execute 中传入的
// 把 TaskController 给放到 top 中去，在 Task 中可以通过 this.top 来访问
const time = moment_1.default();
const outputPath = path_1.default.resolve(process.cwd(), './output/');
const yearPath = path_1.default.resolve(outputPath, time.format('YYYY') + ' 年');
const monthPath = path_1.default.resolve(yearPath, time.format('MM') + ' 月');
const dayPath = path_1.default.resolve(monthPath, time.format('DD') + ' 日');
taskController_1.default.create()
    .initHelper(() => ({ time, outputPath, yearPath, monthPath, dayPath }))
    .add(tasks_1.getAllCode)
    .add(tasks_1.getCodeDetail)
    .add(tasks_1.getProfitList)
    .add(tasks_1.getTransactionRecords)
    .next();
