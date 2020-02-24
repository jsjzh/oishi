import Task from '../shared/task';

import path from 'path';
import fs from 'fs-extra';
import moment from 'moment';

import { GetShareDetail } from '../service';
import TaskController from '../shared/taskController';

const main = Task.create();

main.excute = (helper: TaskController['helper']) => {};

export default main;
