// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (fn: (...args) => any, timeout: number) => {
  const debounceTimeout = Math.max(timeout, 1)
  let currentTimeout

  return (...args) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }

    return new Promise(resolve => {
      currentTimeout = setTimeout(() => {
        resolve(fn(...args))
      }, debounceTimeout)
    })
  }
}
