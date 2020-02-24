declare function success(str: string): void;
declare function successBg(str: string): void;
declare function error(str: string): void;
declare function errorBg(str: string): void;
declare function info(str: string): void;
declare function infoBg(str: string): void;
declare const _default: {
    success: typeof success;
    successBg: typeof successBg;
    error: typeof error;
    errorBg: typeof errorBg;
    info: typeof info;
    infoBg: typeof infoBg;
};
export default _default;
