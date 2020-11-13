import { RollupJsonOptions as jsonOptions } from '@rollup/plugin-json';
import { Options as resolveOptions } from '@rollup/plugin-node-resolve';
import { RollupCommonJSOptions as commonjsOptions } from '@rollup/plugin-commonjs';
import { MinifyOptions } from 'terser';
import T from '../../types';
export interface ILibOptions {
    pkg: Partial<T.IBasePkg> & Record<keyof any, any>;
    json: jsonOptions;
    resolve: resolveOptions;
    terser: Omit<MinifyOptions, 'sourceMap'>;
    commonjs: commonjsOptions;
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
