const { utils } = require('../lib');

console.log(utils.realType.isNumber(123));
console.log(utils.realType.isString('123'));
console.log(utils.realType.isBoolean(true));
console.log(utils.realType.isObject({}));
console.log(utils.realType.isNull(null));
console.log(utils.realType.isUndefined(undefined));
console.log(utils.realType.isArray([]));
console.log(utils.realType.isFunction(() => {}));
console.log(utils.realType.isSymbol(Symbol('foo')));
console.log(utils.realType.isDate(new Date()));
console.log(utils.realType.isBigInt(1n));

console.log(utils.realType.isMap(new Map([])));
console.log(utils.realType.isSet(new Set([])));
console.log(utils.realType.isWeakMap(new WeakMap([])));
console.log(utils.realType.isWeakSet(new WeakSet([])));
