/* eslint-env node */
"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const html = {
  filename: "index.html",
  template: path.join(__dirname, "src/index.html")
};

module.exports = [{
  mode: "development",
  name: "app",
  context: __dirname,
  entry: ["./src/index.js"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.min.js"
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [{
      enforce: "pre",
      test: /\.(js|jsx)/,
      exclude: /node_modules/,
      use: [{
        loader: "eslint-loader"
      }]
    }, {
      test: /\.(js|jsx)/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }]
    }, {
      test: /\.(sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader",
      ],
    }]
  },
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".scss"
    ]
  },
  devtool: "inline-sourcemap",
  plugins: [
    new HtmlWebpackPlugin({
      filename: html.filename,
      template: html.template
    }),
    new MiniCssExtractPlugin()
  ]
}];