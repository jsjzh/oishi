const Joi = require('../lib').default;
const { OishiJoi } = require('../lib');

const oishi = new OishiJoi();

const validateProject = oishi.createSchema(
  Joi.object({
    name: Joi.string().required(),
    type: Joi.number().optional(),
  }),
);

const allowObject = {
  name: 'king',
  type: 1,
};

const notAllowObject = {
  name: 'king',
};

const result1 = validateProject.validate(allowObject);
console.log(result1);
const result2 = validateProject.validate(notAllowObject);
console.log(result2);

(async () => {
  const result3 = await validateProject.validateAsync(allowObject);
  console.log(result3);
  const result4 = await validateProject.validateAsync(notAllowObject);
  console.log(result4);
})();
