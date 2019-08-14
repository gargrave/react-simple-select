module.exports = {
  components: ['src/components/Select/Select.tsx'],
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
    [{}],
  ).parse,
  webpackConfig: require('./config/webpack.dev.js'),
}
