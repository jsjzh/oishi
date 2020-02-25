import path from 'path';
import fs from 'fs-extra';
import { Queue } from '@oishi/fund-shared';

import { GetShareDetail } from '../../service';
import Task from '../../shared/task';
import { fileExistAndBack } from '../../shared/file';

const main = Task.create('爬取基金队列');

main.execute(function(this: Task, callback: any) {
  const helper = this.top.helper;
  const apiPath = path.resolve(helper.dayPath, 'GetShareDetail');

  const reqs = helper.allCode.map(
    ({ code, name }: { code: string; name: string }) => async (
      callback: any,
    ) => {
      const codePath = path.resolve(apiPath, `${code}-${name}.json`);
      const data = await fileExistAndBack(codePath);
      if (!data) {
        const rspData = await GetShareDetail({ FundCode: code });
        await fs.writeJSON(codePath, rspData, { spaces: 2 });
      }
      setTimeout(callback, 3000);
    },
  );

  const queue = new Queue(reqs);
  queue.final(callback);
  queue.next();
});

export default main;
