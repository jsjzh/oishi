import execa from 'execa';

export const ensureCli = async (
  cli: string | string[],
  command = '--version',
) => {
  try {
    if (Array.isArray(cli)) {
      for (const _cli of cli) {
        await execa(_cli, [command]);
      }
    } else {
      await execa(cli, [command]);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getGitConfig = async (
  props: string,
  cwd: string,
): Promise<string> => {
  const { stdout } = await execa('git', ['config', '--get', props], { cwd });
  return stdout ? stdout : '';
};

export const getLatestVersion = async (dep: string) => {
  const { stdout } = await execa('npm', ['info', dep, 'version'], {
    stdio: 'pipe',
  });
  return stdout ? stdout : '';
};
