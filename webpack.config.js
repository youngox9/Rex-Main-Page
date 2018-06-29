const path = require('path');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV;
const fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const setPath = function (folderName) {
  return path.join(__dirname, folderName);
}

const config = {
  entry: {
    vendor: ['./src/index.js', 'babel-polyfill'],
  },
  resolveLoader: {
    modules: [setPath('node_modules')]
  },
  optimization: {},
  mode: 'production',
  plugins: [
    new UglifyJsPlugin({
      cache: true,
      parallel: 4,
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        isStaging: (NODE_ENV === 'development' || NODE_ENV === 'staging'),
        NODE_ENV: '"' + NODE_ENV + '"'
      }
    })
  ],
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: ['es2015']
          }
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')({
                  grid: true
                })
              ]
            },
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
        }]
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-sprite-loader'
      // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   loader: 'file-loader'
      // }
    ]
  },
  watch: true,
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  }
};
module.exports = config;