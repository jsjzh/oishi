import path from 'path';
import moment from 'moment';

import TaskController from './shared/taskController';

import {
  getAllCode,
  getCodeDetail,
  getProfitList,
  getTransactionRecords,
} from './tasks';

// 是否要使用 rxjs 重新改造
// 是否要写一个函数，可以限制并发数，并且每次发起请求的间隔也可以设置

const time = moment();

const outputPath = path.resolve(process.cwd(), './output/');
const yearPath = path.resolve(outputPath, time.format('YYYY') + ' 年');
const monthPath = path.resolve(yearPath, time.format('MM') + ' 月');
const dayPath = path.resolve(monthPath, time.format('DD') + ' 日');

TaskController.create()
  .initHelper(() => ({ time, outputPath, yearPath, monthPath, dayPath }))
  .add(getAllCode)
  .add(getCodeDetail)
  .add(getProfitList)
  .add(getTransactionRecords)
  .next();
