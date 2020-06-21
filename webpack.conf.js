const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const cssModulesQuery = {
  modules: false,
  importLoaders: 2,
  localIdentName: '[name]-[local]-[hash:base64:5]'
};

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, './'),
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      '~~utils': path.resolve(__dirname, 'src/utils'),
      '~~config': path.resolve(__dirname, './src/config'),
      '~~img': path.resolve(__dirname, './img'),
    }
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    })
  ],
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [path.resolve('src'), path.resolve('test')],
    },
    // {
    //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    //   loader: 'url-loader',
    //   // options: {
    //   //   limit: 10000,
    //   //   name: 'img/[name].[hash:7].[ext]'
    //   // }
    // },
    {
      test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
    },
    {
      test: /\.(jpg|png|svg)$/,
      loader: 'file-loader',
      options: {} // name: '[path][name].[hash].[ext]'
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(sass|scss)$/,
      loaders: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        query: cssModulesQuery
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: loader => [require('autoprefixer')()]
        }
      },
      {
        loader: 'sass-loader'
      },
      {
        loader: 'autoprefixer-loader',
        query: {
          browsers: 'last 2 versions'
        }
      }
      ]
    },
    {
      test: /\.css$/,
      loaders: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        query: cssModulesQuery
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: loader => [require('autoprefixer')()]
        }
      }
      ]
    },
    {
      test: /\.less$/,
      loaders: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        query: cssModulesQuery
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: loader => [require('autoprefixer')()]
        }
      },
      {
        loader: 'less-loader'
      }
      ]
    },
    {
      test: /\.styl$/,
      loaders: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        query: cssModulesQuery
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: loader => [require('autoprefixer')()]
        }
      },
      {
        loader: 'stylus-loader'
      }
      ]
    },
    {
      test: /\.html$/,
      loaders: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    global: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};