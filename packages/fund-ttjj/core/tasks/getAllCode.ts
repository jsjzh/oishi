import Task from '../shared/task';

import path from 'path';
import fs from 'fs-extra';
import moment from 'moment';

import { GetMyAssetDetails } from '../service';
import TaskController from '../shared/taskController';

const main = Task.create();

main.excute = (helper: TaskController['helper']) => {
  const apiPath = path.resolve(helper.dayPath, 'GetMyAssetDetails.json');

  fs.ensureFileSync(apiPath);

  if (!fs.readFileSync(apiPath).length) {
    GetMyAssetDetails().then(data =>
      fs.writeJSONSync(apiPath, data, { spaces: 2 }),
    );
  }
};

export default main;
