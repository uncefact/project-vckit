module.exports = ({ config }) => {
  // looks like storybook having trouble with emotion as for now => manually configuration webpack

  // re-apply babel configuration as available in package.json (storybook doesn't pick it)
  config.module.rules[0].use[0].loader = require.resolve("babel-loader");
  config.module.rules[0].use[0].options.presets = [
    require.resolve("@babel/preset-env", {
      targets: {
        node: "current"
      }
    }),
    require.resolve("@babel/preset-typescript"),
    require.resolve("@babel/preset-react"),
    require.resolve("@emotion/babel-preset-css-prop")
  ];

  // adding react-docgen-typescript-loader in loader to allow for props parsing and integration in storybook
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [require.resolve("babel-loader"), require.resolve("react-docgen-typescript-loader")]
  });
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
