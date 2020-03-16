import chalk from 'chalk';
import { compose } from 'ramda';

const curryLog = (logType: any) => compose(console.log, logType, formatStr);

const formatStr = (str: string) => str;

const success = curryLog(chalk.green);
const successBg = curryLog(chalk.bgGreen.black);
const error = curryLog(chalk.red);
const errorBg = curryLog(chalk.bgRed.black);
const info = curryLog(chalk.yellow);
const infoBg = curryLog(chalk.bgYellow.black);

export default {
  success,
  successBg,
  error,
  errorBg,
  info,
  infoBg,
};
