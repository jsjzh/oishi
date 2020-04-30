import { __awaiter } from "tslib";
import execa from 'execa';
export const ensureCli = (cli, command = '--version') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (Array.isArray(cli)) {
            for (const _cli of cli) {
                yield execa(_cli, [command]);
            }
        }
        else {
            yield execa(cli, [command]);
        }
        return true;
    }
    catch (error) {
        return false;
    }
});
export const getGitConfig = (props, cwd) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa('git', ['config', '--get', props], { cwd });
    return stdout ? stdout : '';
});
export const getLatestVersion = (dep) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa('npm', ['info', dep, 'version'], {
        stdio: 'pipe',
    });
    return stdout ? stdout : '';
});
