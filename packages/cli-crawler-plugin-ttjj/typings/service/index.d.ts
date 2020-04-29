import { DynamicObject } from '../../global';
export interface ICreateService {
    GetMyAssetDetails<T>(): Promise<T>;
    GetShareDetail<T>(): Promise<T>;
    GetTransactionRecords<T>(): Promise<T>;
    GetProfitList<T>(): Promise<T>;
}
export declare const createService: (baseUrl: string, config: any, baseData: DynamicObject<any>) => {
    GetMyAssetDetails: (data: any) => any;
    GetShareDetail: (data: any) => any;
    GetTransactionRecords: (data: any) => any;
    GetProfitList: (data: any) => any;
};
