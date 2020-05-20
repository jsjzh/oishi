export class Logger {
  space() {
    console.log();
  }
  success(...args: string[]) {
    console.log(...args);
  }
  info(...args: string[]) {
    console.info(...args);
  }
  warn(...args: string[]) {
    console.warn(...args);
  }
}

export default new Logger();
