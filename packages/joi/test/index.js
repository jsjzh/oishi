const Joi = require('../lib').default;
const { OishiJoi } = require('../lib');

const oishi = new OishiJoi({
  handleError(error) {
    console.log('error', JSON.stringify(error));
    console.log();
  },
});

let demo = Joi.string().required();
let demo2 = Joi.string().optional();
let demo3 = Joi.object({
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  key: Joi.string().optional(),
  obj: Joi.object({
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    key: Joi.string().required(),
  }).required(),
});

const validateProject = oishi.createSchema(demo3);

const allowObject = {
  name: 'king',
  type: 'type',
};

const notAllowObject = {
  name: 'king',
};

const result1 = validateProject.validate(allowObject);
const result2 = validateProject.validate(notAllowObject);

(async () => {
  const result3 = await validateProject.validateAsync(allowObject);
  const result4 = await validateProject.validateAsync(notAllowObject);
})();
