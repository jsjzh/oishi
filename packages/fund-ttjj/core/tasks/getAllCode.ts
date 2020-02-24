import Task from '../shared/task';

import path from 'path';
import fs from 'fs-extra';

import { GetMyAssetDetails } from '../service';

const main = Task.create();

main.execute(function(this: Task, callback: any) {
  const helper = this.top.helper;
  const apiPath = path.resolve(helper.dayPath, 'GetMyAssetDetails/data.json');

  fs.ensureFileSync(apiPath);

  const resData = fs.readFileSync(apiPath);

  const injectAllCode = (data: any) => {
    this.top.helper.allCode = data.AssetDetails.map((item: any) => ({
      code: item.FundCode,
      name: item.FundName,
    }));
    callback();
  };

  if (!resData.length) {
    GetMyAssetDetails().then(data => {
      fs.writeJSONSync(apiPath, data, { spaces: 2 });
      injectAllCode(data);
    });
  } else {
    injectAllCode(JSON.parse(resData.toString()));
  }
});

export default main;
