/**
 * eg. importAll(require.context("PATH", false, /\.md$/))
 */
export const importAll = (r: __WebpackModuleApi.RequireContext): unknown[] => r.keys().map(r);
// https://webpack.js.org/guides/dependency-management/#context-module-api
// unable to refactor to pass in as a path -> https://github.com/webpack/webpack/issues/9300#issuecomment-524744609
