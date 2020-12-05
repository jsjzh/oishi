import _Joi from '@hapi/joi';
import _JoiType from '../joi';

export type RealType<T> = T extends _JoiType.Schema
  ? T extends _JoiType.ObjectSchema<{}>
    ? _JoiType.RealType<T['schemaType']>
    : T['schemaType']
  : _JoiType.RealType<T>;

export interface OishiJoiOptions {
  handleError?: (
    error: Pick<_JoiType.ValidationResult, 'error' | 'errors' | 'warning'>,
  ) => void;
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
  ): RealType<T> {
    const { value, ...errorResult } = schema.validate(_value, options);

    if (errorResult.error || errorResult.errors || errorResult.warning) {
      if (typeof options.handleError === 'function') {
        options.handleError(errorResult);
      } else {
        throw new Error(
          `oishiJoi validate error: ${
            errorResult.error?.message
              ? errorResult.error?.message
              : errorResult.error
          }`,
        );
      }
    }

    return value;
  }

  private async __validateAsync<T>(
    schema: _JoiType.Schema,
    options: OishiJoiOptions & _JoiType.AsyncValidationOptions,
    _value: any,
  ): Promise<RealType<T>> {
    let result;
    try {
      result = await schema.validateAsync(_value, options);
    } catch (error) {
      if (typeof options.handleError === 'function') {
        options.handleError(error);
      } else {
        throw new Error(
          `oishiJoi validate error: ${
            error.details[0].message ? error.details[0].message : error
          }`,
        );
      }
    }
    return result;
  }
}

const Joi: _JoiType.Root = _Joi;

export default Joi;
