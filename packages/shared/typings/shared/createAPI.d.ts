import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
export declare type CreateAPIOptions<T = any> = AxiosRequestConfig & {
    handleOptions?: (options: AxiosRequestConfig) => AxiosRequestConfig;
    handleResp?: <T>(resp: T) => any;
    handleError?: (error: AxiosError) => any;
};
export default class CreateAPI {
    static create(baseURL: string, baseOptions?: CreateAPIOptions): CreateAPI;
    baseURL: string;
    baseOptions: AxiosRequestConfig;
    constructor(baseURL: string, baseOptions?: CreateAPIOptions);
    getJSON<T = any>(endPoint: string, query: CreateAPIOptions<T>['params'], options?: CreateAPIOptions<T>): Promise<any>;
    postJSON<T = any>(endPoint: string, body: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): Promise<any>;
    postForm<T = any>(endPoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): Promise<any>;
    putJSON<T = any>(endpoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): Promise<any>;
    patchJSON<T = any>(endpoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): Promise<any>;
    deleteJSON<T = any>(endpoint: string, data: CreateAPIOptions<T>['data'], options?: CreateAPIOptions<T>): Promise<any>;
    jsonp<T = any>(endpoint: string, data: CreateAPIOptions['data'], options?: CreateAPIOptions & {
        param?: string;
        prefix?: string;
        name?: string;
        timeout?: number;
    }): Promise<any>;
    request<T>(endPoint: string, options?: CreateAPIOptions<T>, isJsonp?: boolean): Promise<any>;
    protected __formatURL(baseURL: string, endPoint?: string): string;
    protected __checkStatus(resp: AxiosResponse): AxiosResponse<any>;
    protected __checkResp(data: any): any;
}
