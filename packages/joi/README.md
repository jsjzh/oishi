# `@oishi/joi`

simple Joi。做了一点微小的工作，修改了 `@type/joi` 的描述文件，重新包装了 `Joi` 的调用方式，`typescript` 不香么？

> 简单介绍一下 `Joi`，这是一个可以在运行时帮助做参数验证非常好的一个库
>
> 但是说到参数验证，`typescript` 不行么，的确可以，但是 `typescript` 是编译时校验，且如果参数写的都是 `any`... 就等着收刀片吧
>
> 程序编译后，在运行时无法校验参数，这时候使用 `Joi` 就可以解决这个问题

这里附上 `Joi` 的相关资源 [Joi Gitub](https://github.com/sideway/joi)，[Joi doc](https://joi.dev/)，有需要可以自查

## 介绍

既然有了 `Joi`，为什么我还要包裹一层，多此一举？私以为，在实际使用过程中，对于验证后的参数没有智能提示，返回的 `result` 是个 `any` 类型，这就非常不 `ts`，所以就做了一些改动，包装了调用方式，并增加了两个可以获取确切值类型的 `ts` 类型推论方法，具体可以参见 [使用](#使用) 环节

## 安装

```shell
npm install @oishi/joi
# or
yarn add @oishi/joi
```

## 特性

1. 使用 `Joi` 验证值后，`result` 可以返回正确的类型
2. 曝露 `SchemaType` 和 `ValidateType` 方法，方便获取值类型

## 使用

### 简单参数验证

这里旨在介绍日常简单的使用方式

```ts
import Joi, { OishiJoi } from '@oishi/joi';

const oishi = new OishiJoi();

const schema = Joi.object({
  name: Joi.string(),
  age: Joi.string(),
  detail: Joi.object({ job: Joi.string() }),
});

const validator = oishi.createSchema(schema);

const allow = { name: 'king', age: '18', detail: { job: 'developer' } };
const notAllow = { name: 'king', age: 18, detail: { job: 'developer' } };

// 若使用 typescript，这里就可以得到 result 的类型提示
const result = validator.validate(allow);
// 即：在输入 result. 后，可以得到智能提示
console.log(result.name);
console.log(result.detail);
// 多层级也不在话下
console.log(result.detail.job);

(async () => {
  const asyncResult = await validator.validateAsync(allow);
})();

// 报错，验证不通过，Throw new Error
const result2 = validator.validate(notAllow);
```

### 获取正确类型

在平时开发时，声明 `schema` 之后，往往还需要声明 `interface`，这里提供两个 `helper` 函数，用于获取 `schema` 或者 `validator` 的接口类型

```ts
import Joi, { OishiJoi, SchemaType, ValidateType } from '@oishi/joi';

const oishi = new OishiJoi();

const schema = Joi.object({
  name: Joi.string(),
  age: Joi.string(),
  detail: Joi.object({ job: Joi.string() }),
});

const validator = oishi.createSchema(schema);

type RealShemaType = SchemaType<typeof schema>;
type RealValidateType = ValidateType<typeof validator>;

let schemaItem: RealShemaType;
// 可以获取到 ts 的智能提示
// schemaItem.detail.job

// 可以获取到 ts 的智能提示
let validateItem: RealValidateType;
// validateItemschemaItem.detail.job
```

### 友好错误处理

若不传入 `handleError`，则会在验证出错时直接将错误信息抛出，若想捕获错误只能通过 `try catch`

若传入 `handleError`，则可以在验证错误时进行错误处理，比如上报信息或其他

另外，在 `new OishiJoi()` 的时候可以传入 `handler` 做统一处理，在 `createSchema` 时也可以传入 `handler`，做单独的 `schema` 错误处理

```ts
import Joi, { OishiJoi } from '@oishi/joi';

const oishi = new OishiJoi({
  handleError: (errors) => console.error(errors),
});

const schema = Joi.object({
  name: Joi.string(),
  age: Joi.string(),
  detail: Joi.object({ job: Joi.string() }),
});

const validator = oishi.createSchema(schema, {
  handleError: (errors) => {
    // 一些特殊的处理
  },
});

const schema2 = Joi.object({
  type: Joi.string(),
});

const validator2 = oishi.createSchema(schema2);
```

## API

```ts
const oishi = new OishiJoi();
```

### oishi.createSchema

```ts
oishi.createSchema(schema: Joi.Schema, options?: {handleError:(error) => void})
```

`schema`: `Joi.Schema` 的类型，可以通过 `Joi.object()` 或者 `Joi.number()` 等生成  
`options`: `{handleError:(error) => void}`

### validator.validate

```ts
validator.validate(value:any, options?:Joi.ValidationOptions)
```

`value`: `any`  
`options`: `Joi.ValidationOptions`

### validator.validateAsync

```ts
validator.validateAsync(value:any, options?:Joi.AsyncValidationOptions)
```

`value`: `any`  
`options`: `Joi.AsyncValidationOptions`

## example

> TODO，一些使用例子

## TODO

1. 使用 `.required()` 或者 `.optional()` 后，能更加智能推导返回值类型
