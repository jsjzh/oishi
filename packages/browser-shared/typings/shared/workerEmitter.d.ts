export default class WorkerEmitter {
    static PROMISE_FLAG: string;
    static PROMISE_DONE: string;
    private listeners;
    private worker;
    constructor(worker: Worker | Window);
    on(type: string, callback: (data: any) => void): void;
    once(type: string, callback: (data: any) => void): void;
    remove(type: string): void;
    emit(type: string, data: any): void;
    promise(type: string, data: any): Promise<unknown>;
    onPromise(type: string, callback: (data: any) => any): void;
    private _emit;
}
