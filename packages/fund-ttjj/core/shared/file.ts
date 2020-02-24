import fs from 'fs-extra';

export const fileExistAndBack = async (path: string) => {
  await fs.ensureFile(path);
  const data = await fs.readFile(path);
  return !data.length ? false : data.toString();
};
