const config = require("./webpack.config.js");
const webpack = require("webpack");

// Get the public path from environment or use the default for this repo
const publicPath = process.env.PUBLIC_PATH || "/c-v/";

// Set the public path for GitHub Pages
config.output.publicPath = publicPath;

// Add plugin to define PUBLIC_PATH for use in the app
const definePluginIndex = config.plugins.findIndex(
  (plugin) => plugin instanceof webpack.DefinePlugin
);

if (definePluginIndex !== -1) {
  // Remove the existing DefinePlugin
  config.plugins.splice(definePluginIndex, 1);
}

// Add a new DefinePlugin with the correct PUBLIC_PATH
config.plugins.push(
  new webpack.DefinePlugin({
    "process.env.PUBLIC_PATH": JSON.stringify(publicPath),
    "process.env.NODE_ENV": JSON.stringify("production"),
  })
);

module.exports = config;
