const fs = require('fs')
const path = require('path')

const readFiles = async (dir, onFileContent, options) => {
  // eslint-disable-next-line no-console
  const { fileFilter, onComplete, onError = console.error } = options

  fs.readdir(dir, function(err, filenames) {
    const totalFiles = filenames && filenames.length
    let filesScanned = 0

    const incrementCount = () => {
      filesScanned += 1
      if (filesScanned >= totalFiles) {
        if (onComplete) onComplete()
      }
    }

    if (err) {
      onError(err)
      return
    }

    filenames.forEach(function(filename) {
      if (!fileFilter || !filename.match(fileFilter)) {
        incrementCount()
      } else {
        try {
          const content = fs.readFileSync(path.join(dir, filename))
          onFileContent(filename, content)
          incrementCount()
        } catch (err) {
          onError(err)
        }
      }
    })
  })
}

module.exports = readFiles
