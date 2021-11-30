const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin("styles/[name].css");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {// 模塊 輸出給 webpack or node 讀取或編譯
  context: path.resolve(__dirname,"./app"),
  entry: {
    index: 'index',
    about: 'about'
  },
  output: {// 輸出不可以減少路徑
    path: path.resolve(__dirname,"./tmp"),
    filename: './js/[name].js?[hash:8]',//?[hash:8]快取不會重複
  },
  resolve: {
    modules: [// 在引入模塊時可以省略路徑
      path.resolve('app'),
      path.resolve('app/js'),
      path.resolve('app/js/object'),
      path.resolve('app/styles'),
      path.resolve('app/images'),
      path.resolve('app/assets'),
      path.resolve('node_modules')
    ],
    extensions: ['.js']// 可以省略副檔名
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vender',
          chunks: 'initial',
          enforce: true
        },
      },
    },
  },
  devServer: {// 啟動 server 環境，透過 localhost 開啟開發中的網頁
    compress: true,// 壓縮以便快速開啟
    port: 3000,
    stats: {
      assets: true,// 添加资源信息
      cached: false,// 添加缓存（但未构建）模块的信息
      chunkModules: false,// 将构建模块信息添加到 chunk 信息
      chunkOrigins: false,// 添加 chunk 和 chunk merge 来源的信息
      chunks: false,// 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
      colors: true,// 等同于`webpack --colors`
      hash: false,// 添加 compilation 的 hash
      modules: false,// 添加构建模块信息
      reasons: false,// 添加模块被引入的原因
      source: false,// 添加模块的源码
      version: false,// 添加 webpack 版本信息
      warnings: false,// 添加警告
    }
  },
  module: {
    rules: [
      // {
      //   test:/\.html$/,
      //   use: [{
      //     loader: "file-loader",// 搬移檔案
      //     options: {
      //       name:'[path][name].[ext]'// path路徑 name檔名 ext副檔名
      //     } 
      //   }]
      // },
      {
        test: /\.pug$/,
        use: ['html-loader','pug-html-loader'],
        use: [
          {
          loader: 'html-loader',
            options: {
              minimize: false //不壓縮 HTML
            }
          },
          {
          loader: 'pug-html-loader',
            options: {
              pretty: true // 美化HTML 的編排 (不壓縮HTML的一種)
            }
          },
        ],
        // include: path.resolve('app/pug'),
        // exclude: path.resolve('./node_modules'),
      },
      {
        test:/\.(woff|woff2|ttf|eot)$/,
        loader: "file-loader",
        options: {
          name:'[path][name].[ext]?[hash:8]'
        },
        include: path.resolve('app/assets'),
        exclude: path.resolve('./node_modules') 
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(['css-loader','postcss-loader']),// loader是從後面執行到前面的
        include: path.resolve('app/styles'),
        exclude: path.resolve('./node_modules')
      },
      {
        test: /\.(sass|scss)$/,
        use: extractCSS.extract([
          // 'style-loader',// 注入css到js內，透過loader轉換成base64的格式，放進css內
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]),
        include: path.resolve('app/styles'),
        exclude: path.resolve('./node_modules')
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.resolve('.')
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        include: path.resolve('app/images'),
        exclude: path.resolve('./node_modules'),
        use: [
          {
            loader: 'url-loader',// 處理大圖片、icon壓縮
            options: {
              limit: 8192,// 圖片超過8192kb，都會轉換base64的格式
              name: '[path][name].[ext]?[hash:8]'// 路徑 名稱 副檔名 圖片快取更新
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          },
        ]
      },
      {

      }
    ]
  },
  plugins: [
    extractCSS,
    new CopyWebpackPlugin([
      {from: "assets", to: "assets"},// from起始資料夾 to搬移資料夾
    ]),
    new webpack.ProvidePlugin({// 非必要不要使用ProvidePlugin
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new HtmlWebpackPlugin({
      title: 'bn',
      filename: 'index.html',
      template: 'html/template.html',
      viewport: 'width=device-width, initial-scale=1.0',
      // chunks: ['vender','index'],//指定需要引入的js，沒有設置就默認全部引入
      minify: {
        collapseWhitespace: false,
        keepClosingSlash: false,
        removeComments: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        useShortDoctype: false
      }
    }),
    new HtmlWebpackPlugin({
      title: 'about',
      filename: 'about.html',
      template: 'pug/about.pug',
      viewport: 'width=device-width, initial-scale=1.0',
      // chunks: ['vender','about'],
      minify: {
        collapseWhitespace: false,
        keepClosingSlash: false,
        removeComments: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        useShortDoctype: false
      }
    })
  ]
};