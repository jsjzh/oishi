import fs from 'fs-extra';

export default class Files {
  root: string;

  constructor(root: string) {
    this.root = root;
  }

  async getAllFiles() {
    return await this.__getFile(this.root, []);
  }

  async __getFile(dir: string, files: string[]) {
    const stat = await fs.stat(dir);

    if (stat.isFile()) {
      files.push(dir);
    } else if (stat.isDirectory()) {
      await Promise.all(
        (await fs.readdir(dir)).map(
          async (d) => await this.__getFile(`${dir}/${d}`, files),
        ),
      );
    }
    return files;
  }
}
