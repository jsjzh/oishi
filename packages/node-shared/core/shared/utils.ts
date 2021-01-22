import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';

// 以成功的状态退出命令行
export const successExit = () => process.exit(0);

// 以失败的状态退出命令行
export const errorExit = () => process.exit(1);

export const realType = (
  obj: any,
):
  | 'Number'
  | 'String'
  | 'Boolean'
  | 'Null'
  | 'Undefined'
  | 'Function'
  | 'Symbol'
  | 'Date'
  | 'BigInt'
  | 'Maps'
  | 'Sets'
  | 'WeakMaps'
  | 'WeakSets'
  | string =>
  ((Object.prototype.toString.call(obj).match(/^\[object (\w+)\]$/g) &&
    RegExp.$1) as unknown) as string;

const isBoolean = (obj: any) => realType(obj) === 'Boolean';
const isString = (obj: any) => realType(obj) === 'String';

export const runLineCmdSyncCreater = (cwd: string = process.cwd()) => {
  return (
    cmd: string,
    options: ExecSyncOptionsWithStringEncoding & {
      showExecuteCmd?: boolean;
    } = { showExecuteCmd: true, encoding: 'utf8', stdio: 'inherit' },
  ) => {
    const { showExecuteCmd, stdio, encoding } = options;

    options.showExecuteCmd = isBoolean(showExecuteCmd) ? showExecuteCmd : true;
    options.encoding = isString(encoding) ? encoding : 'utf8';
    options.stdio = isString(stdio) ? stdio : 'inherit';

    try {
      if (options.showExecuteCmd) {
        delete options.showExecuteCmd;
        console.log('');
        console.log(`将在 ${cwd} 运行指令 ${cmd}`);
        console.log('');
      }

      return execSync(cmd, { cwd, ...options });
    } catch (error) {
      throw new Error(`在 ${cwd} 路径运行 ${cmd} 指令出错`);
    }
  };
};
