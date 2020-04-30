import T from './types';

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
};

export const cleanArgs = (cmd: any) => {
  const args: T.DynamicObject<any> = {};
  cmd.options.forEach((o: any) => {
    const key = camelize(o.long.replace(/^--/, ''));
    typeof cmd[key] !== 'function' &&
      typeof cmd[key] !== 'undefined' &&
      (args[key] = cmd[key]);
  });
  return args;
};
