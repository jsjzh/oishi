export interface Template {
  type:
    | 'core'
    | 'eslintrc'
    | 'gitignore'
    | 'prettierrc'
    | 'global.d.ts'
    | 'package'
    | 'readme'
    | 'tsconfig.dev'
    | 'tsconfig';
  path: string;
  value: string;
}

const templates: Template[] = [
  {
    type: 'core',
    path: 'core/index.ts',
    value: `import { DynamicObject } from '../global';

const infos: DynamicObject = {
  name: 'king',
  profession: 'developer',
};

export const getInfos = () =>
  Object.keys(infos).forEach((key) => console.log(key, infos[key]));

getInfos();
`,
  },
  {
    type: 'eslintrc',
    path: '.eslintrc.js',
    value: `module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
  },
};
`,
  },
  {
    type: 'gitignore',
    path: '.gitignore',
    value: `.DS_Store
.idea/
.vscode/

node_modules

/src`,
  },
  {
    type: 'prettierrc',
    path: '.prettierrc.js',
    value: `module.exports = {
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 一行最多 80 字符
  printWidth: 80,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 末尾一直需要逗号
  trailingComma: 'all',
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 换行符使用 lf
  endOfLine: 'lf',
};
`,
  },
  {
    type: 'global.d.ts',
    path: 'global.d.ts',
    value: `export interface DynamicObject<T = any> {
  [key: string]: T;
}
`,
  },
  {
    type: 'package',
    path: 'package.json',
    value: `{
  "name": "<% name %>",
  "version": "<% version %>",
  "description": "<% description %>",
  "author": "<% author %>",
  "license": "ISC",
  "main": "src/index.js",
  "types": "typings/index.d.ts",
  "files": [
    "src",
    "typings",
    "package.json",
    "global.d.ts",
    "README.md"
  ],
  "scripts": {
    "build:ts": "rm -rf ./src ./typings && tsc --project ./",
    "prepublish": "npm run build:ts"
  },
  "dependencies": {
    "tslib": "^1.11.1"
  },
  "devDependencies": {
    "@types/node": "^13.9.1",
    "@typescript-eslint/eslint-plugin": "^2.23.0",
    "@typescript-eslint/parser": "^2.23.0",
    "eslint": "^6.8.0",
    "eslint-config-alloy": "^3.6.0",
    "typescript": "^3.8.3"
  }
}
`,
  },
  {
    type: 'readme',
    path: 'README.md',
    value: `# hello world

## hello oishi

https://github.com/jsjzh/oishi
`,
  },
  {
    type: 'tsconfig.dev',
    path: 'tsconfig.dev.json',
    value: `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    // "allowJs": true,
    // "checkJs": true,
    "incremental": true,
    "sourceMap": true
  }
}
`,
  },
  {
    type: 'tsconfig',
    path: 'tsconfig.json',
    value: `{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "lib": ["ESNext"],
    "importHelpers": true,
    "listEmittedFiles": true,
    "resolveJsonModule": true,
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,

    "baseUrl": "./",
    "outDir": "./src",
    "rootDir": "./core",

    "declaration": true,
    "declarationDir": "./typings"
  },
  "include": ["./core/**/*.ts", "./global.d.ts"]
}
`,
  },
];

export default templates;
