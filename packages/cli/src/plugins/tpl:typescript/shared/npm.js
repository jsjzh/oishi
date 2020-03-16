"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
class NpmManager {
    constructor(from) {
        this.from = from;
        this.pkgTpl = require(from);
    }
    setProps(props, value) {
        this.pkgTpl[props] = value;
        return this;
    }
    rewrite() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.writeJSON(this.from, this.pkgTpl);
        });
    }
}
exports.default = NpmManager;
