const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader } = require("react-app-rewired");
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [ tsImportPluginFactory({
        libraryDirectory: 'es',
        libraryName: 'antd-mobile',
        style: true,
      }) ]
    })
  };

  config = rewireLess.withLoaderOptions({
        modifyVars: { 
          "@brand-primary": "#001451",
          "@color-text-base": "#333333",
          "@color-text-base-inverse": "#000000",
          "@color-text-placeholder": "#6372A0",
          // "@toast-fill": "#000"
        },
        javascriptEnabled: true,
    })(config, env);

  return config;
}