export default class Files {
    root: string;
    constructor(root: string);
    getAllFiles(): Promise<string[]>;
    __getFile(dir: string, files: string[]): Promise<string[]>;
}
