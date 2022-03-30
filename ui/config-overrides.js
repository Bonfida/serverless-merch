const webpack = require("webpack");

module.exports = function override(webpackConfig) {
  // Polyfill
  webpackConfig.resolve.fallback = {
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    fs: false,
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    constants: require.resolve("constants-browserify"),
  };

  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });
  webpackConfig.module.rules.push({
    test: /\.(js|jsx)$/,
    use: [
      {
        loader: "babel-loader",
      },
    ],
    // Exclude the untransformed packages from the exclude rule here
  });
  return webpackConfig;
};
