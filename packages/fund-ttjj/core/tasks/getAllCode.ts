import Task from '../shared/task';

import path from 'path';
import fs from 'fs-extra';

import { GetMyAssetDetails } from '../service';
import { fileExistAndBack } from '../shared/file';

const main = Task.create('爬取基金列表');

main.execute(async function(this: Task, callback: any) {
  const helper = this.top.helper;
  const apiPath = path.resolve(helper.dayPath, 'GetMyAssetDetails/data.json');

  const data = await fileExistAndBack(apiPath);

  const injectAllCode = (data: any) => {
    helper.allCode = data.AssetDetails.map((item: any) => ({
      code: item.FundCode,
      name: item.FundName,
    }));
    callback();
  };

  let saveData;

  if (!data) {
    const rspData = await GetMyAssetDetails();
    await fs.writeJSON(apiPath, rspData, { spaces: 2 });
    saveData = rspData;
  } else {
    saveData = JSON.parse(data);
  }
  injectAllCode(saveData);
});

export default main;
