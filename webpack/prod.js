// Copyright 2017 caicloud authors. All rights reserved.

const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: {
    index: path.join(__dirname, "../public/src/js/index.js"),
    common: ["moment", "lodash"]
  },
  output: {
    path: path.join(__dirname, "../public/build"),
    filename: "[name].js",
    chunkFilename: "[id].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["happypack/loader?id=js"]
      },
      {
        test: /\.yml$/,
        loader: "yml-loader"
      },
      {
        test: /\.less$/,
        use: ["happypack/loader?id=less"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|jpg|png)\??.*$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: "img/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, "../public/src/js"), "node_modules"],
    extensions: [".js", ".json"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.ProvidePlugin({
      _: "lodash"
    }),
    new HappyPack({
      id: "js",
      threadPool: happyThreadPool,
      threads: 4,
      loaders: ["babel-loader?cacheDirectory=true"]
    }),
    new HappyPack({
      id: "less",
      threadPool: happyThreadPool,
      threads: 4,
      loaders: ["style-loader", "css-loader", "less-loader"]
    })
  ]
};
