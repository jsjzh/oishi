"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ramda_1 = require("ramda");
const path_1 = tslib_1.__importDefault(require("path"));
exports.curryProjectConcatPath = ramda_1.curry((projectPath, filePath) => path_1.default.resolve(projectPath, filePath));
