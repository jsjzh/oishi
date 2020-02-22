import { CreateAPI } from '@oishi/fund-shared';
import path from 'path';
const dataPath = path.resolve(process.cwd(), './config/secret.json');
const sendData = require(dataPath);

const tradeapilvs5 = new CreateAPI(
  'https://tradeapilvs5.1234567.com.cn/',
  {
    handleResp: data => data.Data,
  },
  sendData.userToken,
);

export const GetMyAssetDetails = tradeapilvs5.postForm(
  '/User/home/GetMyAssetDetails',
);
