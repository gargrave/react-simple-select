const path = require('path')

const { getLocalIdent } = require('./css/getLocalIdent')

const APP_ROOT = '../'

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.min.js',
    library: 'react-simple-select',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, APP_ROOT, 'dist'),
  },
  //
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  //
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, APP_ROOT, 'src'),
        use: {
          loader: 'babel-loader',
          options: {},
        },
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
