const path = require("path");
const slsw = require("serverless-webpack");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: slsw.lib.webpack.isLocal ? slsw.lib.entries : "./src/index.ts",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  devtool: slsw.lib.webpack.isLocal
    ? "eval-cheap-module-source-map"
    : "source-map",
  resolve: {
    extensions: [".json", ".ts", ".js"],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "index.js",
  },
  target: "node",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, "./src/serverless"),
            path.resolve(__dirname, "./src/.webpack"),
          ],
        ],
        options: {
          configFile: path.resolve(__dirname, "tsconfig.json"),
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "/tls/rds-combined-ca-bundle.pem"),
          to: "rds-combined-ca-bundle.pem",
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, "tsconfig.json"),
      },
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /^rdf-canonize-native$/ }), // optional dependency loaded by rdf-canonize
    new webpack.IgnorePlugin({
      resourceRegExp: /^web-streams-polyfill\/ponyfill\/es2018$/,
    }), // optional dependency loaded by ky-universal
    new webpack.ProvidePlugin({
      fetch: ["node-fetch", "default"],
    }),
  ],
};
