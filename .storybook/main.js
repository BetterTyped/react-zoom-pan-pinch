module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-storysource",
    "@storybook/addon-a11y",
  ],
  webpackFinal: (webpackConfig) => {
    const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
      ({ constructor }) =>
        constructor && constructor.name === "ModuleScopePlugin",
    );

    webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
    return webpackConfig;
  },
};
