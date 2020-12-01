export declare const sleep: (time: number) => Promise<unknown>;
export declare const retryPromise: <T = any, D = any>(promise: (data: D) => Promise<T>, data: D, handleResp: (resp: T) => boolean, maxRetryCount?: number) => Promise<void>;
export declare const asyncEvery: <T>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<boolean>;
export declare const asyncSome: <T>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>) => Promise<boolean>;
