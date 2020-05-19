import chalk from 'chalk';

export class Logger {
  _log(str: string) {
    console.log(str);
  }
  space() {
    this._log('');
  }
  success(str: string) {
    this._log(chalk.green(str));
  }
  info(str: string) {
    this._log(chalk.yellow(str));
  }
  error(str: string) {
    this._log(chalk.red(str));
  }
  successBg(str: string) {
    this._log(chalk.bgGreen.black('「SUCCESS」') + chalk.green(` ${str}`));
  }
  infoBg(str: string) {
    this._log(chalk.bgYellow.black('「INFO」') + chalk.yellow(` ${str}`));
  }
  errorBg(str: string) {
    this._log(chalk.bgRed.black('「ERROR」') + chalk.red(` ${str}`));
  }
  successBgTip(title: string, str: string) {
    this._log(
      chalk.bgGreen.black(`「${title} SUCCESS」`) + chalk.green(` ${str}`),
    );
  }
  infoBgTip(title: string, str: string) {
    this._log(
      chalk.bgYellow.black(`「${title} INFO」`) + chalk.yellow(` ${str}`),
    );
  }
  errorBgTip(title: string, str: string) {
    this._log(chalk.bgRed.black(`「${title} ERROR」`) + chalk.red(` ${str}`));
  }
}

export default new Logger();
