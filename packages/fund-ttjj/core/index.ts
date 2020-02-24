import path from 'path';
import moment from 'moment';

import TaskController from './shared/taskController';

import {
  getAllCode,
  getCodeDetail,
  getProfitList,
  getTransactionRecords,
} from './tasks';

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
