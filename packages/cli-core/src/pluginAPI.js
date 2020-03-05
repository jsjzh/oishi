"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PluginAPI {
    constructor(name, container) {
        this.name = name;
        this.container = container;
    }
    registerCommand(command, configs, task) {
        const description = configs.description;
        const options = configs.options;
        const commandItem = { command, description, options, task };
        this.container.registerCommand(commandItem);
    }
}
exports.default = PluginAPI;
