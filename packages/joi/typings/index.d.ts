import _JoiType from '../joi';
export declare type RealType<T> = T extends _JoiType.Schema ? T extends _JoiType.ObjectSchema<{}> ? _JoiType.RealType<T['schemaType']> : T['schemaType'] : _JoiType.RealType<T>;
export interface OishiJoiOptions {
    handleError?: (error: Pick<_JoiType.ValidationResult, 'error' | 'errors' | 'warning'>) => void;
}
export declare class OishiJoi {
    private __options;
    constructor(options?: OishiJoiOptions);
    createSchema<T extends _JoiType.Schema>(schema: T, options?: OishiJoiOptions): {
        validate: (value: any, validateOptions?: _JoiType.ValidationOptions | undefined) => RealType<T>;
        validateAsync: (value: any, validateAsyncOptions?: _JoiType.AsyncValidationOptions | undefined) => Promise<RealType<T>>;
    };
    private __validate;
    private __validateAsync;
}
declare const Joi: _JoiType.Root;
export default Joi;
