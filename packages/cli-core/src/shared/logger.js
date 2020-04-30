import chalk from 'chalk';
export class Logger {
    _log(str) {
        console.log(str);
    }
    success(str) {
        this._log(chalk.green(str));
    }
    info(str) {
        this._log(chalk.yellow(str));
    }
    error(str) {
        this._log(chalk.red(str));
    }
    successBg(str) {
        this._log(chalk.bgGreen.black('「SUCCESS」') + chalk.green(` ${str}`));
    }
    infoBg(str) {
        this._log(chalk.bgYellow.black('「INFO」') + chalk.yellow(` ${str}`));
    }
    errorBg(str) {
        this._log(chalk.bgRed.black('「ERROR」') + chalk.red(` ${str}`));
    }
    successBgTip(title, str) {
        this._log(chalk.bgGreen.black(`「${title} SUCCESS」`) + chalk.green(` ${str}`));
    }
    infoBgTip(title, str) {
        this._log(chalk.bgYellow.black(`「${title} INFO」`) + chalk.yellow(` ${str}`));
    }
    errorBgTip(title, str) {
        this._log(chalk.bgRed.black(`「${title} ERROR」`) + chalk.red(` ${str}`));
    }
}
export default new Logger();
