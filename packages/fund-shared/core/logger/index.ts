import chalk from 'chalk';

export class Logger {
  success(str: string) {
    console.log(chalk.green(str));
  }

  successBg(str: string) {
    console.log(chalk.bgGreen.black(str));
  }

  error(str: string) {
    console.log(chalk.red(str));
  }

  errorBg(str: string) {
    console.log(chalk.bgRed.black(str));
  }

  info(str: string) {
    console.log(chalk.yellow(str));
  }

  infoBg(str: string) {
    console.log(chalk.bgYellow.black(str));
  }
}

export default new Logger();
