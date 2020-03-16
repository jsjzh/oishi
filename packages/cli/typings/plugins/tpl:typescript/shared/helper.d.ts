import { Context } from '@oishi/cli-core/typings/content';
export default class Helper {
    ctx: Context<{}>;
    constructor(ctx: Context<{}>);
    validatePkgName(name: string): string | undefined;
    copyTempToCwd(template: string): Promise<void>;
    getGitConfig(props: string): Promise<string>;
}
