export declare const cliRollupConfig: (options: import("./configs/rollup/cli.rollup.config").ICliOptions) => () => Promise<{
    input: string;
    output: {
        file: string;
        name: string;
        banner: string;
        format: string;
    };
    external: string[];
    plugins: any[];
}>;
export declare const libRollupConfig: (options: import("./configs/rollup/lib.rollup.config").ILibOptions) => () => Promise<{
    input: string;
    output: {
        file: string;
        name: string;
        banner: string;
        format: string;
    };
    external: string[];
    plugins: any[];
}>;
