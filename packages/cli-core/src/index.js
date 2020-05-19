import PluginContainer from './plugin';
import { createContext } from './content';
import { readJSONSync } from 'fs-extra';
import logger from './shared/logger';
import program from 'commander';
import path from 'path';
import leven from 'leven';
export default class CliCore {
    constructor({ root, pkg, context, plugins }) {
        this.root = root;
        this.context = context ? context : () => ({});
        this.pluginContainer = new PluginContainer(root, plugins || []);
        let _pkg = pkg;
        if (!_pkg) {
            try {
                _pkg = readJSONSync(path.resolve(root, 'package.json'));
            }
            catch (error) {
                _pkg = {};
            }
        }
        this.pkg = _pkg;
    }
    execute() {
        program
            .version(this.pkg.version)
            .usage('<command>')
            .action(({ args: [inputCommand] }) => {
            program.outputHelp();
            console.log();
            logger.error(`Unknown command ${inputCommand}`);
            console.log();
            let suggestion = '';
            program.commands
                .map((cmd) => cmd.name())
                .forEach((cmd) => {
                const isBestMatch = leven(cmd, inputCommand) < leven(suggestion, inputCommand);
                if (leven(cmd, inputCommand) < 3 && isBestMatch) {
                    suggestion = cmd;
                }
            });
            if (suggestion) {
                logger.info(`Did you mean ${suggestion}?`);
            }
        });
        this.pluginContainer.traverse((commandItem) => {
            const context = createContext(this.root, this.context);
            const required = commandItem.command.match(/<(.+?)>/g);
            const optional = commandItem.command.match(/\[(.+?)\]/g);
            const hasRequired = !!required;
            const hasOptional = !!optional;
            const commandHasOptions = hasRequired || hasOptional;
            const requiredUsage = hasRequired && required && required.join(' ');
            const optionalUsage = hasRequired && optional && optional.join(' ');
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
