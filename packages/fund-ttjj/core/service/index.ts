import { CreateAPI } from '@oishi/fund-shared';
import { userToken } from './secret.json';

const tradeapilvs5 = new CreateAPI(
  'https://tradeapilvs5.1234567.com.cn/',
  {
    handleResp: data => data.Data,
  },
  userToken,
);

export const GetMyAssetDetails = tradeapilvs5.postForm(
  '/User/home/GetMyAssetDetails',
);
