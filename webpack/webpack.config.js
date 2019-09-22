const path = require('path')

module.exports = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../', 'src'),
        use: {
          loader: 'babel-loader',
          options: {},
        },
      },
      {
        test: /\.scss$/,
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
    ],
  },
}
