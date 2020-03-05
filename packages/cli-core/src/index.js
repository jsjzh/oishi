"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = tslib_1.__importDefault(require("commander"));
const pluginContainer_1 = tslib_1.__importDefault(require("./pluginContainer"));
class CliCore {
    // helper: OCreateHelper;
    constructor({ root, pkg, plugins }) {
        this.root = root;
        this.pkg = pkg;
        // this.helper = createHelper(helperOptions);
        this.pluginContainer = new pluginContainer_1.default(root, plugins);
    }
    execute() {
        commander_1.default.version(this.pkg.version).usage('<command> [options]');
        this.pluginContainer.traverse((command) => {
            commander_1.default.command(command.command).description(command.description);
            command.options.forEach(option => commander_1.default.option.apply(null, option));
            commander_1.default.action(() => {
                command.task();
            });
        });
        commander_1.default.parse(process.argv);
    }
}
exports.default = CliCore;
