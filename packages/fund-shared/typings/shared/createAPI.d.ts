import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
declare type IRequestConfig = AxiosRequestConfig & {
    handleOption?: (option: AxiosRequestConfig) => any;
    handleResp?: (data: any) => any;
};
declare type IRequestResult<T> = Promise<T> & {
    promise: Promise<T>;
    cancel: () => void;
};
declare class CreateAPI {
    host: string;
    baseConfig: IRequestConfig;
    baseData: {
        [k: string]: string;
    };
    instance: AxiosInstance;
    constructor(baseURL: string, baseConfig?: IRequestConfig, baseData?: {
        [k: string]: string;
    });
    checkStatus(resp: AxiosResponse): AxiosResponse<any>;
    chekcResp(data: any): any;
    request<T = any>(endPoint: string, reqConfig?: IRequestConfig): IRequestResult<T>;
    getJSON<T>(endPoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    postJSON<T = any>(endPoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    postForm<T = any>(endPoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    putJSON<T = any>(endPoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    patchJSON<T = any>(endPoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    deleteJSON<T = any>(endPoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    jsonp<T = any>(endPoint: string, config?: Pick<IRequestConfig, 'handleResp'>): Promise<T>;
}
export default CreateAPI;
