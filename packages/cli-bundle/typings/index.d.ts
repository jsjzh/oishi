import CliCore from '@oishi/cli-core';
import _BundleBaseStore from './execute/base';
import _BundleBusinessStore from './execute/business';
export default class JarvisBundleCli {
    static create(): JarvisBundleCli;
    cli: CliCore<{}>;
    constructor();
    execute(): void;
}
export declare const BundleBaseStore: typeof _BundleBaseStore;
export declare const BundleBusinessStore: typeof _BundleBusinessStore;
