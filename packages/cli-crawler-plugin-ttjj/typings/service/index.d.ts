import { IRequestConfig } from '@oishi/oishi-shared/typings/shared/createAPI';
import { DynamicObject } from '../../global';
export interface ICreateService {
    GetMyAssetDetails<T>(): Promise<T>;
    GetShareDetail<T>(): Promise<T>;
    GetTransactionRecords<T>(): Promise<T>;
    GetProfitList<T>(): Promise<T>;
}
export declare const createService: (baseUrl: string, config: IRequestConfig, baseData: DynamicObject<any>) => {
    GetMyAssetDetails: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
    GetShareDetail: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
    GetTransactionRecords: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
    GetProfitList: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
};
