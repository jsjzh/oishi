import Task from '../../shared/task';

import path from 'path';
import fs from 'fs-extra';

import { fileExistAndBack } from '../../shared/file';

const main = Task.create('分析资产情况');

main.execute(async function(this: Task, callback: any) {
  const helper = this.top.helper;
  const { outputPath } = helper;

  const stat = await fs.stat(outputPath);

  console.log(stat);

  callback();
});

export default main;
