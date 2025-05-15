const config = require("./webpack.config.js");
const webpack = require("webpack");

// Get the repository name from the environment or default to the last part of the path
const publicPath = process.env.PUBLIC_PATH || "/";

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

// Add HtmlWebpackPlugin with base href
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

// Find and remove the existing HtmlWebpackPlugin
const htmlPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
);

if (htmlPluginIndex !== -1) {
  config.plugins.splice(htmlPluginIndex, 1);
}

// Add a new HtmlWebpackPlugin with base tag
config.plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "src/index.html"),
    filename: "index.html",
    inject: "body",
    minify: false,
    base: publicPath,
  })
);

module.exports = config;
