import validateNpmPackageName from 'validate-npm-package-name';
import { Context } from '@oishi/cli-core/typings/content';
import execa from 'execa';
import { copy } from 'fs-extra';

export default class Helper {
  ctx: Context<{}>;

  constructor(ctx: Context<{}>) {
    this.ctx = ctx;
  }

  validatePkgName(name: string): string | undefined {
    const { errors, validForNewPackages, warnings } = validateNpmPackageName(
      name,
    );

    if (!validForNewPackages) {
      if (errors) return errors.join(' ');
      if (warnings) return warnings.join(' ');
    }
  }

  async copyTempToCwd(template: string) {
    await copy(template, this.ctx.root);
  }

  async getGitConfig(props: string): Promise<string> {
    try {
      const { stdout } = await execa('git', ['config', '--get', props], {
        cwd: this.ctx.root,
      });
      return stdout;
    } catch (error) {
      this.ctx.logger.info(`git config --git ${props} not find`);
      return 'not find';
    }
  }
}
