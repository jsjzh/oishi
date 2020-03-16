/* eslint-disable @typescript-eslint/no-require-imports */
const { BundleBaseStore } = require('@jarvis/cli-bundle');
const base = new BundleBaseStore();

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: false },
    }),
  },
  serializer: {
    createModuleIdFactory: base.createModuleIdFactory.bind(base),
  },
};
