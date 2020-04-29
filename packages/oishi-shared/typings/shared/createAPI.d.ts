import { CoreOptions, Response } from 'request';
export declare type CreateAPIOptions = CoreOptions & {
    handleOption?: (options: CreateAPIOptions) => CreateAPIOptions;
    handleResp?: (data: any) => any;
    handleError?: (error: any, response: Response) => any;
};
export default class CreateAPI {
    baseUrl: string;
    baseOptions: CreateAPIOptions;
    constructor(baseUrl: string, baseOptions?: CreateAPIOptions);
    getJSON<T = any>(endPoint: string, qs: Record<keyof any, any>, options?: CreateAPIOptions): Promise<T>;
    postJSON<T = any>(endPoint: string, body: Record<keyof any, any>, options?: CreateAPIOptions): Promise<T>;
    protected __request<T>(endPoint: string, options: CreateAPIOptions): Promise<T>;
}
