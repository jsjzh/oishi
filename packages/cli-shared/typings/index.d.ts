export declare const ensureCli: (cli: string | string[], command?: string) => Promise<boolean>;
export declare const getGitConfig: (props: string, cwd: string) => Promise<string>;
export declare const getLatestVersion: (dep: string) => Promise<string>;
