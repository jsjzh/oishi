import { AxiosRequestConfig, AxiosResponse } from 'axios';
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
    constructor(host: string, baseConfig?: IRequestConfig);
    request<T = any>(endPoint: string, reqConfig?: IRequestConfig): IRequestResult<T>;
    checkStatus(resp: AxiosResponse): AxiosResponse<any>;
    chekcResp(data: any): any;
    getJSON<T = any>(endpoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    postJSON<T = any>(endpoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    postForm<T = any>(endpoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    putJSON<T = any>(endpoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    patchJSON<T = any>(endpoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    deleteJSON<T = any>(endpoint: string, data?: {
        [k: string]: string;
    }, config?: IRequestConfig): IRequestResult<T>;
    jsonp<T = any>(endPoint: string, config?: Pick<IRequestConfig, 'handleResp'>): Promise<T>;
    static getAPIUrl(prefix: string, endpoint: string): string;
}
export default CreateAPI;
