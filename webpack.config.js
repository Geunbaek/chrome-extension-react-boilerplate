const path = require("path");
const manifest = require("./manifest.js");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (...argv) => {
  return {
    mode: argv.mode,
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: "react",
      }),
      new HtmlWebpackPlugin({
        title: manifest.name,
        template: "./index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "manifest.js",
            to: "manifest.json",
            transform() {
              return JSON.stringify(manifest);
            },
          },
        ],
      }),
    ],
    optimization: {
      minimizer: [new TerserWebpackPlugin()],
    },
  };
};
