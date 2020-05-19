export declare class Logger {
    _log(str: string): void;
    space(): void;
    success(str: string): void;
    info(str: string): void;
    error(str: string): void;
    successBg(str: string): void;
    infoBg(str: string): void;
    errorBg(str: string): void;
    successBgTip(title: string, str: string): void;
    infoBgTip(title: string, str: string): void;
    errorBgTip(title: string, str: string): void;
}
declare const _default: Logger;
export default _default;
