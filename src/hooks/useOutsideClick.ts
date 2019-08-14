import * as React from 'react'

const NOOP = () => void 0

export type OutsideClickProps = {
  containerRef: any // eslint-disable-line @typescript-eslint/no-explicit-any
  onInsideClick?: (event: Event) => void
  onOutsideClick?: (event: Event) => void
}

export const useOutsideClick = ({
  containerRef,
  onInsideClick = NOOP,
  onOutsideClick = NOOP,
}: OutsideClickProps) => {
  React.useEffect(() => {
    const handleDocumentClick = event => {
      if (containerRef && containerRef.current) {
        const isOutsideClick = !containerRef.current.contains(event.target)
        isOutsideClick ? onOutsideClick(event) : onInsideClick(event)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick, true)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick, true)
    }
  }, [containerRef, onInsideClick, onOutsideClick])
}
