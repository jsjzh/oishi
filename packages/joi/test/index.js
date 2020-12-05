const oishi = new OishiJoi();

let demo = Joi.string().required();
let demo2 = Joi.string().optional();
let demo3 = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().optional(),
  key: Joi.string().required(),
  obj: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().optional(),
    key: Joi.string().required(),
  }),
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
console.log(result1);
const result2 = validateProject.validate(notAllowObject);
console.log(result2);

(async () => {
  const result3 = await validateProject.validateAsync(allowObject);
  console.log(result3);
  demoFun(result3);
  const result4 = await validateProject.validateAsync(notAllowObject);
  console.log(result4);
})();
