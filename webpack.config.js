const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const unixFormatter = require('eslint/lib/formatters/unix')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'eval',
  entry: _.compact([
    'babel-polyfill',
    './src/index',
  ]),
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: _.compact([
    isProduction && new webpack.optimize.DedupePlugin(),
    isProduction && new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {
        comments: false,
      },
    }),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      API_BASE_URL: JSON.stringify(isProduction
        ? 'https://blarg-im.herokuapp.com/v1'
        : 'http://localhost:8000/v1'
      ),
      WS_URL: JSON.stringify(isProduction
        ? 'wss://blarg-im.herokuapp.com/v1/ws'
        : 'ws://localhost:8000/v1/ws'
      ),
      TEMASYS_APP_KEY: JSON.stringify(
        'a4ce66c5-0018-4695-b695-f063e4301a45'
      ),
    }),
  ]),
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel', 'eslint'],
      exclude: /node_modules/,
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    }],
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './src/style')],
  },
  resolve: {
    root: path.resolve(__dirname, './src'),
    alias: {
      components: 'components',
      handlers: 'handlers',
      actions: 'actions',
    },
    extensions: ['', '.js', '.jsx', '.json'],
  },
  eslint: {
    formatter: unixFormatter,
  },
}
