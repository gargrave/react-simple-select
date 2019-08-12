const path = require('path')

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
    extensions: ['.js', '.ts'],
  },
  //
  module: {
    rules: [
      {
        test: /\.tsx?/,
        include: /src/,
        use: {
          loader: 'babel-loader',
          options: {},
        },
      },
    ],
  },
}
