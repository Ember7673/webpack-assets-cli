var path = require('path');
const webpack = require('webpack');
const glob = require("glob");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const config = {
  entry: getEntry(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[name].[ext]",
              limit: 1024, // size <= 1kib
              outputPath: 'assets/img', //输出到文件夹,基于output根目录
              publicPath: './assets/img', //html的img标签src所指向图片的位置，与outputPath一致
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|lib)/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-withimg-loader'
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ]
};

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, chunks) {
  return {
    template: `./src/pages/${name}/index.html`,
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    hash: true, //开启hash  ?[hash]
    chunks: chunks,
    minify: process.env.NODE_ENV === "development" ? false : {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true, //去除属性引用
    },
  };
};

function getEntry () {
  var entry = {};
  //读取src目录所有page入口
  glob.sync('./src/pages/**/*.js')
    .forEach(function (name) {
      var start = name.indexOf('src/') + 4,
        end = name.length - 3;
      var eArr = [];
      var n = name.slice(start, end);
      n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口 
      n = n.split('/')[1];
      eArr.push(name);
      entry[n] = eArr;
    });
  return entry;
};

//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach(element => {
  htmlArray.push({
    _html: element,
    title: '',
    chunks: ['vendor', element]
  })
})

//自动生成html模板
htmlArray.forEach((element) => {
  config.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})

module.exports = config;