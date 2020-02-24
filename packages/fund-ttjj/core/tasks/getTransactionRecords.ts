import Task from '../shared/task';
import Queue from '../shared/queue';

import path from 'path';
import fs from 'fs-extra';

import { GetTransactionRecords } from '../service';

const main = Task.create();

main.execute(function(this: Task, callback: any) {
  const helper = this.top.helper;

  const apiPath = path.resolve(helper.dayPath, 'GetTransactionRecords');
  const reqs = helper.allCode.map(
    ({ code, name }: { code: string; name: string }) => async (
      callback: any,
    ) => {
      const codePath = path.resolve(apiPath, `${code}-${name}.json`);
      const data = await GetTransactionRecords({ FundCode: code });
      fs.ensureFileSync(codePath);
      fs.writeJSONSync(codePath, data, { spaces: 2 });
      setTimeout(() => callback(), 3000);
    },
  );

  const queue = new Queue(reqs);
  queue.final(callback);
  queue.next();
});

export default main;
