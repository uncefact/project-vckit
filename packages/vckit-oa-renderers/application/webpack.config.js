const webpackConfig = require("../webpack.config");

webpackConfig.entry.app = ["./application/index.tsx"];
webpackConfig.devServer.port = 3010;

module.exports = webpackConfig;
