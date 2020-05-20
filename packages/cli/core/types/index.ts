declare namespace T {
  interface IContent {
    cliRoot: string;
    npmRegistry: string;
  }
  type DynamicObject = Record<keyof any, any>;
}

export default T;
