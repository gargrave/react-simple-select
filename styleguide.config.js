const path = require('path')

const pkg = require('./package.json')

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
  styleguideDir: 'docs',
  title: `React Simple Select ${pkg.version}`,
  webpackConfig: require('./webpack/webpack.config.js'),
}
