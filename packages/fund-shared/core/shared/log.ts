import chalk from 'chalk';

function success(str: string) {
  console.log(chalk.green(str));
}

function successBg(str: string) {
  console.log(chalk.bgGreen.black(str));
}

function error(str: string) {
  console.log(chalk.red(str));
}

function errorBg(str: string) {
  console.log(chalk.bgRed.black(str));
}

function info(str: string) {
  console.log(chalk.yellow(str));
}

function infoBg(str: string) {
  console.log(chalk.bgYellow.black(str));
}

export default {
  success,
  successBg,
  error,
  errorBg,
  info,
  infoBg,
};
