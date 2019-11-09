import * as React from 'react'

export type UseHotkeysProps = {
  active: boolean
  handlers: {
    [keyCode: string]: (event) => void
  }
}

export const useHotkeys = ({ active, handlers }: UseHotkeysProps) => {
  React.useEffect(() => {
    const handleKeyDown = event => {
      if (event.code in handlers) {
        handlers[event.code](event)
      }
    }

    if (active) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, handlers])
}
