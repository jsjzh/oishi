import T from '../../types';
export interface ICliOptions {
    pkg: Partial<T.IBasePkg> & Record<keyof any, any>;
}
declare const _default: (options: ICliOptions) => () => Promise<{
    input: string;
    output: {
        file: string;
        name: string;
        banner: string;
        format: string;
    };
    external: string[];
    plugins: any[];
}>;
export default _default;
