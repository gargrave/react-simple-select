const fs = require('fs')
const nodeSass = require('node-sass')

const outFile = './dist/react-simple-select.css'

nodeSass.render(
  {
    file: './src/components/Select/styles/Select.scss',
  },
  (error, result) => {
    if (!error) {
      const { css } = result
      fs.writeFile(outFile, css, _err => {})
    }
  },
)
