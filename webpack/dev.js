// Copyright 2017 caicloud authors. All rights reserved.

const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  // 开启缓存。第一次编译会比较慢，之后编译速度非常快
  cache: true,
  // 开启源码 map 文件功能
  devtool: "cheap-module-source-map",
  entry: {
    index: path.join(__dirname, "../public/src/js/index.js")
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
    // 定义变量
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // 别名
    new webpack.ProvidePlugin({
      _: "lodash"
    }),
    // 采用 dll，加快编译速度
    new webpack.DllReferencePlugin({
      name: "common",
      context: path.join(__dirname, "../public/build/"),
      manifest: require("../public/build/common-manifest.json")
    }),
    // 对 js、less 采取多进程编译
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
