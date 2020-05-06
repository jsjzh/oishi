const parsePackageName = require('parse-package-name');

export type IDependencies = Record<
  string,
  {
    version: string;
    resolved: string;
    integrity: string;
    requires?: Record<string, string>;
    dependencies?: IDependencies;
  }
>;

export type PDependencies = Record<string, { versions: string[] }>;

export const deepParseNpmLock = (
  obj: IDependencies,
  result: PDependencies,
): PDependencies => {
  Object.keys(obj).forEach((dep) => {
    const item = obj[dep];
    if (result[dep]) {
      if (!result[dep].versions.includes(item.version)) {
        result[dep].versions.push(item.version);
      }
    } else {
      result[dep] = { versions: [item.version] };
    }
    if (item.dependencies) {
      deepParseNpmLock(item.dependencies, result);
    }
  });
  return result;
};

export const deepParseYarnLock = (
  obj: IDependencies,
  result: PDependencies,
): PDependencies => {
  Object.keys(obj).forEach((dep) => {
    const item = obj[dep];
    const { name: depName } = parsePackageName(dep);
    if (result[depName]) {
      if (!result[depName].versions.includes(item.version)) {
        result[depName].versions.push(item.version);
      }
    } else {
      result[depName] = { versions: [item.version] };
    }
  });
  return result;
};
