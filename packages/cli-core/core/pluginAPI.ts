import PluginContainer from './pluginContainer';

export interface IRegisterCommandConfig {
  description: string;
  options: IRegisterCommandOption[];
}

export interface ICommandItem {
  command: string;
  description: string;
  options: IRegisterCommandOption[];
  task: () => any;
}

// -p, --preset <presetName>
type flagOption = string;
// Some description
type descOption = string;

export type IRegisterCommandOption = [flagOption, descOption];

export default class PluginAPI {
  name: string;
  container: PluginContainer;

  constructor(name: string, container: PluginContainer) {
    this.name = name;
    this.container = container;
  }

  registerCommand(
    command: string,
    configs: IRegisterCommandConfig,
    task: () => any,
  ) {
    const description = configs.description;
    const options = configs.options;
    const commandItem = { command, description, options, task };
    this.container.registerCommand(commandItem);
  }
}
