"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const ramda_1 = require("ramda");
exports.getAbsolutePath = (root, inputPath) => path_1.default.isAbsolute(inputPath) ? inputPath : path_1.default.resolve(root, inputPath);
exports.curryGetAbsolutePath = ramda_1.curry(exports.getAbsolutePath);
