import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    external: [
      '@babel/runtime/helpers/defineProperty',
      '@babel/runtime/helpers/slicedToArray',
      '@babel/runtime/helpers/typeof',
      'object-assign',
      'prop-types/checkPropTypes',
      'react',
    ],
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      commonjs({
        namedExports: { react: ['createElement'] },
      }),
      babel({
        extensions: ['.ts', '.tsx'],
        externalHelpers: false,
        include: ['src/**/*'],
        runtimeHelpers: true,
      }),
    ],
  },
]
