const config = require("./webpack.config.js");
const webpack = require("webpack");

// The repository name should exactly match the GitHub repo
const repoName = "c-v";
const publicPath = `/${repoName}/`;

// Override the output publicPath to match GitHub Pages
config.output.publicPath = publicPath;

// Find and remove the existing DefinePlugin
const definePluginIndex = config.plugins.findIndex(
  (plugin) => plugin instanceof webpack.DefinePlugin
);

if (definePluginIndex !== -1) {
  config.plugins.splice(definePluginIndex, 1);
}

// Add a new DefinePlugin with the correct values
config.plugins.push(
  new webpack.DefinePlugin({
    "process.env.PUBLIC_PATH": JSON.stringify(publicPath),
    "process.env.NODE_ENV": JSON.stringify("production"),
  })
);

module.exports = config;
