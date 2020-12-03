/* eslint-disable no-useless-call */
import _Joi from '@hapi/joi';
import _JoiType from './typings/joi';

type RealType<T> = T extends _JoiType.Schema
  ? T extends _JoiType.ObjectSchema<{}>
    ? _JoiType.RealType<T['schemaType']>
    : T['schemaType']
  : _JoiType.RealType<T>;

export type OishiJoiOptions = _JoiType.ValidationOptions & {
  handleError?: (
    error: Pick<_JoiType.ValidationResult, 'error' | 'errors' | 'warning'>,
  ) => void;
};

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
      validate: (value: RealType<T>) =>
        this.__validate<T>(
          schema,
          { ...this.__options, ...(options || {}) },
          value,
        ),
    };
  }

  private __validate<T>(
    schema: _JoiType.Schema,
    options: OishiJoiOptions,
    _value: RealType<T>,
  ): RealType<T> {
    const { value, ...errorResult } = schema.validate(_value, options);

    if (errorResult.error || errorResult.errors || errorResult.warning) {
      if (typeof options.handleError === 'function') {
        options.handleError(errorResult);
      } else {
        throw new Error(
          `oishiJoi validate error: ${JSON.stringify(errorResult)}`,
        );
      }
    }

    return value;
  }
}

// const Joi: _JoiType.Root = _Joi;

// export default Joi;

// const oishiJoi = new OishiJoi();

// const one = oishiJoi.createSchema(
//   Joi.object({
//     name: Joi.object({
//       names: Joi.number(),
//     }),
//   }),
// );

// const result = one.validate({
//   name: {
//     names: 123,
//   },
// });
