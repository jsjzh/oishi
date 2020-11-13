import T from '../../types';
export interface ILibOptions {
    pkg: Partial<T.IBasePkg> & Record<keyof any, any>;
    terser: Record<keyof any, any>;
}
declare const _default: (options: ILibOptions) => () => Promise<{
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
