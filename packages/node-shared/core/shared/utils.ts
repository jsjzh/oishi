import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { utils } from '@oishi/shared';

// 以成功的状态退出命令行
export const successExit = () => process.exit(0);

// 以失败的状态退出命令行
export const errorExit = () => process.exit(1);

export const runLineCmdSyncCreater = (cwd: string = process.cwd()) => {
  return (
    cmd: string,
    options: Partial<ExecSyncOptionsWithStringEncoding> & {
      showExecuteCmd?: boolean;
    } = { showExecuteCmd: true, encoding: 'utf8', stdio: 'inherit' },
  ) => {
    const { showExecuteCmd, stdio, encoding } = options;

    options.showExecuteCmd = utils.realType.isBoolean(showExecuteCmd)
      ? showExecuteCmd
      : true;
    options.encoding = utils.realType.isString(encoding) ? encoding : 'utf8';
    options.stdio = utils.realType.isString(stdio) ? stdio : 'inherit';

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
