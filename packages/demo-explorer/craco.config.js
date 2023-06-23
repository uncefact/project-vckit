const webpack = require('webpack')
const path = require('path');

const ouputDir = process.env.REACT_APP_MODE === 'verifier' ? 'build/verifier' : 'build/explorer';

module.exports = {
  babel: {
    plugins: ['@babel/plugin-syntax-import-assertions'],
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = webpackConfig.output.path = path.resolve(ouputDir);
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        http: require.resolve('stream-http'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
      }
      /* ... */
      return webpackConfig
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
}
