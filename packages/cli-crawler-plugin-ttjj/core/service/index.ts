import { IRequestConfig } from '@oishi/oishi-shared/typings/shared/createAPI';
import { CreateAPI } from '@oishi/oishi-shared';
import { DynamicObject } from '../../global';

export interface ICreateService {
  GetMyAssetDetails<T>(): Promise<T>;
  GetShareDetail<T>(): Promise<T>;
  GetTransactionRecords<T>(): Promise<T>;
  GetProfitList<T>(): Promise<T>;
}

export const createService = (
  baseUrl: string,
  config: IRequestConfig,
  baseData: DynamicObject,
) => {
  const service = new CreateAPI(baseUrl, config, baseData);

  return {
    GetMyAssetDetails: (data: any) =>
      service.postForm('/User/home/GetMyAssetDetails', data),
    GetShareDetail: (data: any) =>
      service.postForm('/User/home/GetShareDetail', data),
    GetTransactionRecords: (data: any) =>
      service.postForm('/User/home/GetTransactionRecords', data),
    GetProfitList: (data: any) =>
      service.postForm('/User/home/GetProfitList', data),
  };
};
