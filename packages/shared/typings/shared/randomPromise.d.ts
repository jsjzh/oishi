export interface IDealConfig<T, K> {
    handleTimer?: () => Promise<any>;
    handleWhile: (data: T, resp: K | undefined) => Promise<boolean>;
    handleResp: (resp: K, data: T) => Promise<void>;
}
export default class RandomPromise<T = any, K = any> {
    promise: (data: T) => Promise<K>;
    data: T;
    config: IDealConfig<T, K>;
    __result: any;
    __resp: any;
    constructor(promise: (data: T) => Promise<K>, data: T, config: IDealConfig<T, K>);
    handleTimer(): Promise<any>;
    handleWhile(): Promise<boolean>;
    handleResp(): Promise<void>;
    excute(): Promise<void>;
}
