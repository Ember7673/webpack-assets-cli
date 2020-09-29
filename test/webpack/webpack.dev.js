const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.js');
const webpackConfigDev = {
  mode: 'development', // 通过 mode 声明开发环境
  output: {
    filename: 'js/[name].js',
    path: __dirname + '/dist/js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),//本地服务器所加载的页面所在的目录
    host: 'login.g12e.com',
    compress: true,
    port: 8081
  },//  配置webpack服务
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    })
  ]
}

module.exports = WebpackMerge.merge(webpackConfigBase, webpackConfigDev);