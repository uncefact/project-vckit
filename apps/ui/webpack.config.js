const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Mode = require("frontmatter-markdown-loader/mode");
const { IS_DEVELOPMENT, IS_TEST_ENV, IS_DEV_SERVER, GA_MEASUREMENT_ID, GA_CONFIG_OPTION } = require("./src/config");
const { APP_NAME, FAVICON_PATH } = require("./src/appConfig");

module.exports = {
  entry: {
    app: ["./src/index.tsx"],
  },
  node: {
    fs: "empty",
  },
  context: path.resolve(__dirname),
  target: "web",
  mode: IS_DEVELOPMENT ? "development" : "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash:7].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader",
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [{ loader: "style-loader" }, { loader: "css-loader", options: { url: false } }],
      },
      {
        test: /\.md$/,
        loader: "frontmatter-markdown-loader",
        options: {
          mode: [Mode.BODY],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        IS_LOCAL: JSON.stringify(process.env.IS_LOCAL),
        VCKIT_DOMAIN: JSON.stringify(process.env.VCKIT_DOMAIN),
        VCKIT_API_DOMAIN: JSON.stringify(process.env.VCKIT_API_DOMAIN),
        CONFIG_FILE_ID: JSON.stringify(process.env.CONFIG_FILE_ID),
        MAGIC_API_KEY: JSON.stringify(process.env.MAGIC_API_KEY),
      },
    }),
    new webpack.EnvironmentPlugin({
      // need to define variables here, so later can be overwritten at netlify env var end
      // TODO: use dotenv instead
      NODE_ENV: "development",
      NET: "ropsten",
      INFURA_API_KEY: "bb46da3f80e040e8ab73c0a9ff365d18",
      ETHEREUM_PROVIDER: "notcloudflare", // temporary fix that wont be needed after oa-verify > 6
      MAGIC_API_KEY_FALLBACK: "",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: `${__dirname}/public/static/index.html`,
      GA_MEASUREMENT_ID,
      GA_CONFIG_OPTION,
      APP_NAME: APP_NAME || "VCKit Exemplar",
      FAVICON_PATH: FAVICON_PATH || "/static/images/favicon/favicon.png",
    }),
    ...(!IS_DEV_SERVER
      ? [
          new CompressionPlugin({ test: /\.(js|css|html|svg)$/ }),
          new BrotliPlugin({ test: /\.(js|css|html|svg)$/ }),
          new CopyWebpackPlugin({
            patterns: [
              { from: "public/static/images", to: "static/images" },
              { from: "public/static/demo", to: "static/demo" },
              { from: "public/static/uploads", to: "static/uploads" },
              { from: "public/admin", to: "admin" },
            ],
          }),
        ]
      : []),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /\/node_modules\//,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },

  // Using cheap-eval-source-map for build times
  // switch to inline-source-map if detailed debugging needed
  devtool: !IS_DEVELOPMENT || IS_TEST_ENV ? false : "eval-cheap-source-map",

  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "public"),
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 3000,
    stats: {
      colors: true,
      progress: true,
    },
  },

  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: ["node_modules", path.resolve(__dirname, "src")],
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  bail: true,
};
