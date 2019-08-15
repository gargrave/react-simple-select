type ArgType = string | {} | undefined

export const classNames = (...args: ArgType[]): string => {
  const classes: string[] = []
  const len = args.length

  for (let i = 0; i < len; i += 1) {
    const arg = args[i]

    if (typeof arg === 'string' && arg.length) {
      // string args will be applied directly, assuming they are not empty
      classes.push(arg)
    } else if (typeof arg === 'object') {
      // object args will be treated as conditional classes
      Object.entries(arg).forEach(([className, condition]) => {
        if (condition) {
          classes.push(className)
        }
      })
    }
  }

  return classes.join(' ')
}
