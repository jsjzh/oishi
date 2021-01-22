import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';

// 以成功的状态退出命令行
export const successExit = () => process.exit(0);

// 以失败的状态退出命令行
export const errorExit = () => process.exit(1);

export const realType = (obj: any) =>
  Object.prototype.toString.call(obj).match(/^\[object (\w+)\]$/g) && RegExp.$1;

export const isBoolean = (obj: any) => realType(obj) === 'Boolean';

export const runLineCmdSync = (cwd: string = process.cwd()) => {
  return (
    cmd: string,
    options: ExecSyncOptionsWithStringEncoding & {
      showExecuteCmd: boolean;
      showStdio: boolean;
    } = { encoding: 'utf8', showExecuteCmd: true, showStdio: true },
  ) => {
    const { showExecuteCmd, showStdio } = options;

    options.showExecuteCmd = isBoolean(showExecuteCmd) ? showExecuteCmd : true;
    options.showStdio = isBoolean(showStdio) ? showStdio : true;
    try {
      if (options.showExecuteCmd) {
        console.log('');
        console.log(`将在 ${cwd} 运行指令 ${cmd}`);
        console.log('');
      }
      return execSync(cmd, {
        cwd,
        ...options,
        stdio: options.showStdio ? 'inherit' : 'ignore',
      });
    } catch (error) {
      throw new Error(`在 ${cwd} 路径运行 ${cmd} 指令出错`);
    }
  };
};
