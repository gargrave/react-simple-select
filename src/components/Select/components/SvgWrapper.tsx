import * as React from 'react'

import { classNames } from '../../../utils'
import { styles } from '../Select.helpers'

export type SvgWrapperProps = {
  children: React.ReactNode
  onMouseDown?: (event) => void
  testId?: string
} & { ref?: React.Ref<HTMLDivElement> }

export const SvgWrapper: React.RefForwardingComponent<
  HTMLDivElement,
  SvgWrapperProps
> = React.forwardRef(
  ({ children, onMouseDown, testId }, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        className={classNames(styles.svgWrapper)}
        data-testid={testId}
        onMouseDown={onMouseDown}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)
