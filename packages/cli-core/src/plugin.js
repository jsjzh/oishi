import path from 'path';
import resolve from 'resolve';
export class PluginAPI {
    constructor(container) {
        this.container = container;
    }
    registerCommand(configs, task) {
        this.container.registerCommand(configs, task);
    }
}
export default class PluginContainer {
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
            pluginInfo.pluginPath = path.resolve(this.root, pluginInfo.pluginPath);
        }
        if (!path.isAbsolute(pluginInfo.pluginPath)) {
            try {
                require.resolve(pluginInfo.pluginPath);
            }
            catch (e) {
                pluginInfo.pluginPath = resolve.sync(pluginInfo.pluginPath, {
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
