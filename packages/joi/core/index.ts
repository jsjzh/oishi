import _Joi from '@hapi/joi';
import _JoiType, { ValidationError } from '../joi';

export type SchemaType<T> = T extends _JoiType.Schema
  ? T extends _JoiType.ObjectSchema<{}>
    ? _JoiType.RealType<T['schemaType']>
    : T['schemaType']
  : _JoiType.RealType<T>;

export type ValidateType<
  T extends ReturnType<OishiJoi['createSchema']>
> = ReturnType<T['validate']>;

export interface OishiJoiOptions {
  handleError?: (messages: string[]) => void;
}

export class OishiJoi {
  private __options: OishiJoiOptions;

  constructor(options?: OishiJoiOptions) {
    this.__options = options || {};
  }

  createSchema<T extends _JoiType.Schema>(
    schema: T,
    options?: OishiJoiOptions,
  ) {
    return {
      validate: (value: any, validateOptions?: _JoiType.ValidationOptions) =>
        this.__validate<T>(
          schema,
          { ...this.__options, ...(options || {}), ...(validateOptions || {}) },
          value,
        ),

      validateAsync: async (
        value: any,
        validateAsyncOptions?: _JoiType.AsyncValidationOptions,
      ) =>
        await this.__validateAsync<T>(
          schema,
          {
            ...this.__options,
            ...(options || {}),
            ...(validateAsyncOptions || {}),
          },
          value,
        ),
    };
  }

  private __validate<T>(
    schema: _JoiType.Schema,
    options: OishiJoiOptions & _JoiType.ValidationOptions,
    _value: any,
  ): SchemaType<T> {
    const { value, error } = schema.validate(_value, options);
    if (error) {
      if (typeof options.handleError === 'function') {
        options.handleError(error.details.map((detail) => detail.message));
      } else {
        throw new Error(
          `oishiJoi validate error: ${error.details.map(
            (detail) => detail.message,
          )}`,
        );
      }
    }

    return value;
  }

  private async __validateAsync<T>(
    schema: _JoiType.Schema,
    options: OishiJoiOptions & _JoiType.AsyncValidationOptions,
    _value: any,
  ): Promise<SchemaType<T>> {
    let result;
    try {
      result = await schema.validateAsync(_value, options);
    } catch (error) {
      if (typeof options.handleError === 'function') {
        options.handleError(
          error.details.map((detail: ValidationError) => detail.message),
        );
      } else {
        throw new Error(
          `oishiJoi validate error: ${error.details.map(
            (detail: ValidationError) => detail.message,
          )}`,
        );
      }
    }
    return result;
  }
}

const Joi: _JoiType.Root = _Joi;

export default Joi;
