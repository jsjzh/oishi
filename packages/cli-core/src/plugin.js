"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const resolve_1 = tslib_1.__importDefault(require("resolve"));
class PluginAPI {
    constructor(container) {
        this.container = container;
    }
    registerCommand(configs, task) {
        this.container.registerCommand(configs, task);
    }
}
exports.PluginAPI = PluginAPI;
class PluginContainer {
    constructor(root, plugins) {
        this.root = root;
        this.commands = {};
        plugins.forEach(this.resolvePlugins.bind(this));
    }
    resolvePlugins(pluginOption) {
        const pluginInfo = this.unifyInfo(pluginOption);
        const plugin = this.unifyRequire(pluginInfo.pluginPath);
        this.mountedPlugin(pluginInfo, plugin);
    }
    unifyInfo(pluginOption) {
        const pluginInfo = typeof pluginOption === 'string'
            ? { pluginPath: pluginOption, pluginConfig: {} }
            : pluginOption;
        if (/^(\.|\.\.)/.test(pluginInfo.pluginPath)) {
            pluginInfo.pluginPath = path_1.default.resolve(this.root, pluginInfo.pluginPath);
        }
        if (!path_1.default.isAbsolute(pluginInfo.pluginPath)) {
            try {
                // 直接查找，插件可能在 plugin 的 node_modules 下
                require.resolve(pluginInfo.pluginPath);
            }
            catch (e) {
                // 插件也可能在项目的 node_modules 下
                pluginInfo.pluginPath = resolve_1.default.sync(pluginInfo.pluginPath, {
                    basedir: this.root,
                });
            }
        }
        return pluginInfo;
    }
    unifyRequire(pluginPath) {
        const module = require(pluginPath);
        return module && module.__esModule ? module.default : module;
    }
    mountedPlugin(pluginInfo, plugin) {
        plugin(new PluginAPI(this), pluginInfo.pluginConfig || {});
    }
    registerCommand(configs, task) {
        if (this.commands[configs.command]) {
            throw new Error('command 名重复');
        }
        const description = configs.description;
        const options = configs.options;
        const commondItem = {
            command: configs.command,
            description,
            options,
            task,
        };
        this.commands[configs.command] = commondItem;
    }
    traverse(fn) {
        Object.keys(this.commands).forEach(command => fn(this.commands[command]));
    }
}
exports.default = PluginContainer;
