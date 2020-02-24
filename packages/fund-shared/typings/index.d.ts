import _CreateAPI from './shared/createAPI';
import _Queue from './shared/Queue';
export declare const log: {
    success: (str: string) => void;
    successBg: (str: string) => void;
    error: (str: string) => void;
    errorBg: (str: string) => void;
    info: (str: string) => void;
    infoBg: (str: string) => void;
};
export declare const Queue: typeof _Queue;
export declare const CreateAPI: typeof _CreateAPI;
