const path = require('path')

module.exports = {
  components: ['src/components/Select/Select.tsx'],
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
    [{}],
  ).parse,
  require: [
    path.join(__dirname, 'src/components/Select/styles/Select.scss'),
    path.join(__dirname, 'src/components/Select/styleguide/Styleguide.scss'),
  ],
  title: 'React Simple Select',
  webpackConfig: require('./webpack/webpack.config.js'),
}
