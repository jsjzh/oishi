import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
export declare type CreateAPIOptions<T = any> = AxiosRequestConfig & {
    handleOptions?: (options: AxiosRequestConfig) => AxiosRequestConfig;
    handleResp?: <T>(resp: T) => any;
    handleError?: (error: AxiosError) => any;
};
declare type IRequestResult<T> = Promise<T> & {
    promise: Promise<T>;
    cancel: () => void;
};
export default class CreateAPI {
    static create(baseURL: string, baseOptions?: CreateAPIOptions): CreateAPI;
    baseURL: string;
    baseOptions: AxiosRequestConfig;
    constructor(baseURL: string, baseOptions?: CreateAPIOptions);
    getJSON<T = any>(endPoint: string, query: CreateAPIOptions<T>['params'], options?: CreateAPIOptions<T>): IRequestResult<T>;
    postJSON<T = any>(endPoint: string, body: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): IRequestResult<T>;
    postForm<T = any>(endPoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): IRequestResult<T>;
    putJSON<T = any>(endpoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): IRequestResult<T>;
    patchJSON<T = any>(endpoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): IRequestResult<T>;
    deleteJSON<T = any>(endpoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): IRequestResult<T>;
    request<T>(endpoint: string, options?: CreateAPIOptions<T>): IRequestResult<T>;
    protected __formatURL(baseURL: string, endPoint?: string): string;
    protected __checkStatus(resp: AxiosResponse): AxiosResponse<any>;
    protected __checkResp(data: any): any;
}
export {};
