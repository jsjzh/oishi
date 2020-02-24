import { CreateAPI } from '@oishi/fund-shared';
import path from 'path';
const dataPath = path.resolve(process.cwd(), './config/secret.json');
const sendData = require(dataPath);

const tradeapilvs5 = new CreateAPI(
  'https://tradeapilvs5.1234567.com.cn/',
  { handleResp: data => data.Data },
  { UserId: sendData.UserId },
);

export const GetMyAssetDetails = (
  data: any = {
    CToken: sendData.CToken,
    MobileKey: sendData.MobileKey,
    ServerVersion: sendData.ServerVersion,
    UToken: sendData.UToken,
  },
) => tradeapilvs5.postForm('/User/home/GetMyAssetDetails', data);

export const GetShareDetail = (data: any = {}) =>
  tradeapilvs5.postForm('/User/home/GetShareDetail', data);

export const GetTransactionRecords = (data: any = {}) =>
  tradeapilvs5.postForm('/User/home/GetTransactionRecords', data);

export const GetProfitList = (data: any = {}) =>
  tradeapilvs5.postForm('/User/home/GetProfitList', data);
