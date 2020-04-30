export const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
};
export const cleanArgs = (cmd) => {
    const args = {};
    cmd.options.forEach((o) => {
        const key = camelize(o.long.replace(/^--/, ''));
        typeof cmd[key] !== 'function' &&
            typeof cmd[key] !== 'undefined' &&
            (args[key] = cmd[key]);
    });
    return args;
};
