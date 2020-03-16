"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = tslib_1.__importDefault(require("commander"));
const plugin_1 = tslib_1.__importDefault(require("./plugin"));
const content_1 = require("./content");
class CliCore {
    constructor({ root, pkg, context, plugins }) {
        this.root = root;
        this.pkg = pkg;
        this.ctx = context || {};
        this.pluginContainer = new plugin_1.default(root, plugins || []);
    }
    execute() {
        commander_1.default.version(this.pkg.version).usage('<command>');
        this.pluginContainer.traverse((commandItem) => {
            const context = content_1.createContext(this.root, this.ctx);
            const required = commandItem.command.match(/<(.+?)>/g);
            const optional = commandItem.command.match(/\[(.+?)\]/g);
            const hasRequired = !!required;
            const hasOptional = !!optional;
            const commandHasOptions = hasRequired || hasOptional;
            const requiredUsage = hasRequired && (required === null || required === void 0 ? void 0 : required.join(' '));
            const optionalUsage = hasRequired && (optional === null || optional === void 0 ? void 0 : optional.join(' '));
            const miniProgram = commander_1.default
                .command(commandItem.command)
                .description(commandItem.description);
            if (hasRequired && hasOptional) {
                miniProgram.usage(`${requiredUsage} ${optionalUsage}`);
            }
            else {
                if (hasRequired) {
                    miniProgram.usage(`${requiredUsage}`);
                }
                else if (hasOptional) {
                    miniProgram.usage(`${optionalUsage}`);
                }
                else {
                    miniProgram.usage(' ');
                }
            }
            commandItem.options.forEach((option) => {
                miniProgram.option.apply(miniProgram, option);
            });
            miniProgram.action((...args) => {
                Object.assign(context.argv, miniProgram.opts());
                // 如果 commond 中含有 <...> 或者 [...]
                // 则需要做处理，提取最后一个参数「options 的参数」
                // 也就是说，task 接收到的参数是 >= 1 的，而且会随着 commond 中 hasOptions 的增加而增加
                if (commandHasOptions) {
                    const requiredOptions = args.slice(0, -1);
                    commandItem.task(requiredOptions, context);
                }
                else {
                    commandItem.task([], context);
                }
            });
        });
        commander_1.default.parse(process.argv);
    }
}
exports.default = CliCore;
