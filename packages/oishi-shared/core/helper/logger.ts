export default class Logger {
  title: string;
  constructor(title: string) {
    this.title = title;
  }
  log(...args: any[]) {
    console.log.apply(null, [
      `${new Date()} --- ${this.title} log --- `,
      ...args,
    ]);
  }
  info(...args: any[]) {
    console.info.apply(null, [
      `${new Date()} --- ${this.title} info --- `,
      ...args,
    ]);
  }
  warn(...args: any[]) {
    console.warn.apply(null, [
      `${new Date()} --- ${this.title} warn --- `,
      ...args,
    ]);
  }
  error(...args: any[]) {
    console.error.apply(null, [
      `${new Date()} --- ${this.title} error --- `,
      ...args,
    ]);
  }
}
