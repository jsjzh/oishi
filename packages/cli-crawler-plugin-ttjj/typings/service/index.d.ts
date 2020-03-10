import { IRequestConfig } from '@oishi/oishi-shared/typings/shared/createAPI';
export declare const createService: (baseUrl: string, config: IRequestConfig, baseData: DynamicObject<any>) => {
    GetMyAssetDetails: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
    GetShareDetail: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
    GetTransactionRecords: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
    GetProfitList: (data: any) => import("@oishi/oishi-shared/typings/shared/createAPI").IRequestResult<any>;
};
