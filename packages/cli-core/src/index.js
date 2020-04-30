import program from 'commander';
import PluginContainer from './plugin';
import { createContext } from './content';
export default class CliCore {
    constructor({ root, pkg, context, plugins }) {
        this.root = root;
        this.pkg = pkg;
        this.ctx = context || {};
        this.pluginContainer = new PluginContainer(root, plugins || []);
    }
    execute() {
        program.version(this.pkg.version).usage('<command>');
        this.pluginContainer.traverse((commandItem) => {
            const context = createContext(this.root, this.ctx);
            const required = commandItem.command.match(/<(.+?)>/g);
            const optional = commandItem.command.match(/\[(.+?)\]/g);
            const hasRequired = !!required;
            const hasOptional = !!optional;
            const commandHasOptions = hasRequired || hasOptional;
            const requiredUsage = hasRequired && (required === null || required === void 0 ? void 0 : required.join(' '));
            const optionalUsage = hasRequired && (optional === null || optional === void 0 ? void 0 : optional.join(' '));
            const miniProgram = program
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
                if (commandHasOptions) {
                    const requiredOptions = args.slice(0, -1);
                    commandItem.task(requiredOptions, context);
                }
                else {
                    commandItem.task([], context);
                }
            });
        });
        program.parse(process.argv);
    }
}
