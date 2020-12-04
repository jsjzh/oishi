# `@oishi/joi`

做了一点微小的工作，修改了 @type/joi 的描述文件，重新包装了一下 Joi 的调用方式，在 validate 和 validateAsync 时，可以返回确切的 value 类型，typescript 不香么？

## 使用

```ts
import Joi, { OishiJoi } from '@oishi/joi';
```
