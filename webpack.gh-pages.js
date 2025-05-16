const config = require("./webpack.config.js");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Get the public path from environment variable or use the default for GitHub Pages
const publicPath = process.env.PUBLIC_PATH || "/c-v/";

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

// Find and remove the existing HtmlWebpackPlugin
const htmlPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
);

if (htmlPluginIndex !== -1) {
  config.plugins.splice(htmlPluginIndex, 1);
}

// Find and remove the existing CopyWebpackPlugin
const copyPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.constructor.name === "CopyWebpackPlugin"
);

if (copyPluginIndex !== -1) {
  config.plugins.splice(copyPluginIndex, 1);
}

// Add a new HtmlWebpackPlugin with appropriate settings
config.plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "src/index.html"),
    filename: "index.html",
    inject: "body",
    minify: false,
    // Add base tag for GitHub Pages
    templateParameters: {
      PUBLIC_PATH: publicPath,
    },
  })
);

// Add CopyWebpackPlugin with 404.html
config.plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "public",
        to: "",
        globOptions: {
          ignore: ["**/index.html"],
        },
      },
      {
        from: "src/assets",
        to: "assets",
        noErrorOnMissing: true,
      },
    ],
  })
);

module.exports = config;
