// eslint-disable-next-line @typescript-eslint/no-require-imports
const { BundleBusinessStore } = require('@jarvis/cli-bundle');

const bundleBusinessStore = new BundleBusinessStore();

module.exports = {
  serializer: {
    createModuleIdFactory: bundleBusinessStore.createModuleIdFactory.bind(
      bundleBusinessStore,
    ),
    processModuleFilter: bundleBusinessStore.processModuleFilter.bind(
      bundleBusinessStore,
    ),
    getModulesRunBeforeMainModule: bundleBusinessStore.getModulesRunBeforeMainModule.bind(
      bundleBusinessStore,
    ),
  },
};
