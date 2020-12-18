export default class Logger {
    title: string;
    constructor(title: string);
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    private __log;
}
