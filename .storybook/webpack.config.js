const path = require('path')

const { getLocalIdent } = require('../config/css/getLocalIdent')
const baseConfig = require('../config/webpack.dev')

const APP_ROOT = '../'

module.exports = {
  ...baseConfig,
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, APP_ROOT, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {},
          },
          {
            loader: 'react-docgen-typescript-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              getLocalIdent,
              importLoaders: 2,
              modules: true,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
}
