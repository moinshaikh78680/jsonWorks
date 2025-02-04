const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    process: require.resolve("process/browser"),
    assert: require.resolve("assert/"),
    util: require.resolve("util/"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer/"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
