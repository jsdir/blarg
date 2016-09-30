const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const unixFormatter = require('eslint/lib/formatters/unix')

const isProduction = process.env.BLARG_ENV === 'production'

module.exports = {
  devtool: 'eval',
  entry: _.compact([
    'babel-polyfill',
    !isProduction && 'webpack-dev-server/client?http://localhost:3000',
    !isProduction && 'webpack/hot/only-dev-server',
    './src/index',
  ]),
  output: {
    path: path.join(__dirname, 'dist', 'static'),
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
      API_BASE_URL: JSON.stringify(process.env.YIDE_LOCAL_API
        ? 'http://localhost:8000/v1'
        : 'https://api.blarg.im/v1'
      ),
    }),
  ]),
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel', 'eslint'],
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
    extensions: ['', '.js', '.jsx', '.json'],
  },
  eslint: {
    formatter: unixFormatter,
  },
}
