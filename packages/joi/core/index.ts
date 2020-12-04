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
      validate: (
        value: RealType<T>,
        validateOptions?: _JoiType.ValidationOptions,
      ) =>
        this.__validate<T>(
          schema,
          { ...this.__options, ...(options || {}), ...(validateOptions || {}) },
          value,
        ),

      validateAsync: async (
        value: RealType<T>,
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
    _value: RealType<T>,
  ): RealType<T> {
    const { value, ...errorResult } = schema.validate(_value, options);

    if (errorResult.error || errorResult.errors || errorResult.warning) {
      if (options.handleError) {
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
    _value: RealType<T>,
  ): Promise<RealType<T>> {
    let result;
    try {
      result = await schema.validateAsync(_value, options);
    } catch (error) {
      if (options.handleError) {
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

const oishi = new OishiJoi();

let demo = Joi.string().required();
let demo2 = Joi.number().optional();

const validateProject = oishi.createSchema(
  Joi.object({
    name: Joi.string().required(),
    type: Joi.number().optional(),
  }),
);

// const allowObject = {
//   name: 'king',
//   type: 1,
// };

// const notAllowObject = {
//   name: 'king',
// };

// const result1 = validateProject.validate(allowObject);
// console.log(result1);
// const result2 = validateProject.validate(notAllowObject);
// console.log(result2);

// (async () => {
//   const result3 = await validateProject.validateAsync(allowObject);
//   console.log(result3);
//   const result4 = await validateProject.validateAsync(notAllowObject);
//   console.log(result4);
// })();
