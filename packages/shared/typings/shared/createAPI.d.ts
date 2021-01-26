import { AxiosRequestConfig, AxiosError } from 'axios';
export declare type CreateAPIConfigs = AxiosRequestConfig & {
    handleResp?: (resp: any) => any;
    handleError?: (error: AxiosError) => any;
};
declare type IRequestResult<T> = Promise<T> & {
    promise: Promise<T>;
    cancel: () => void;
};
export default class CreateAPI {
    static create(baseUrl: string, baseConfigs?: CreateAPIConfigs): CreateAPI;
    baseUrl: string;
    baseConfigs: CreateAPIConfigs;
    constructor(baseUrl: string, baseConfigs?: CreateAPIConfigs);
    getJSON<T = any>(endPoint: string, query?: {
        [k: string]: any;
    }, configs?: CreateAPIConfigs): IRequestResult<T>;
    postJSON<T = any>(endPoint: string, body: {
        [k: string]: any;
    }, configs?: CreateAPIConfigs): IRequestResult<T>;
    postForm<T = any>(endPoint: string, data: {
        [k: string]: any;
    }, configs?: CreateAPIConfigs): IRequestResult<T>;
    putJSON<T = any>(endPoint: string, data: {
        [k: string]: any;
    }, configs?: CreateAPIConfigs): IRequestResult<T>;
    patchJSON<T = any>(endPoint: string, data: {
        [k: string]: any;
    }, configs?: CreateAPIConfigs): IRequestResult<T>;
    deleteJSON<T = any>(endPoint: string, data: {
        [k: string]: any;
    }, configs?: CreateAPIConfigs): IRequestResult<T>;
    jsonp<T = any>(endPoint: string, configs?: Pick<CreateAPIConfigs, 'handleResp' | 'handleError'> & {
        timeout?: number;
    }): Promise<T>;
    request<T>(endPoint: string, configs?: CreateAPIConfigs): IRequestResult<T>;
    private __formatBaseUrl;
    private __formatUrl;
    private __checkResp;
}
export {};
