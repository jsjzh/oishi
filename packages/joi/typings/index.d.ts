import _JoiType from '../joi';
export declare type SchemaType<T> = T extends _JoiType.Schema ? T extends _JoiType.ObjectSchema<{}> ? _JoiType.RealType<T['schemaType']> : T['schemaType'] : _JoiType.RealType<T>;
export declare type ValidateType<T extends ReturnType<OishiJoi['createSchema']>> = ReturnType<T['validate']>;
export interface OishiJoiOptions {
    handleError?: (messages: string[]) => void;
}
export declare class OishiJoi {
    private __options;
    constructor(options?: OishiJoiOptions);
    createSchema<T extends _JoiType.Schema>(schema: T, options?: OishiJoiOptions): {
        validate: (value: any, validateOptions?: _JoiType.ValidationOptions | undefined) => SchemaType<T>;
        validateAsync: (value: any, validateAsyncOptions?: _JoiType.AsyncValidationOptions | undefined) => Promise<SchemaType<T>>;
    };
    private __validate;
    private __validateAsync;
}
declare const Joi: _JoiType.Root;
export default Joi;
