import * as React from 'react'
import { memo } from 'react'

import styles from './Select.module.scss'

export enum SelectSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export type SelectProps = {
  /** An optional message to display */
  message?: string
  /**
   * The size of the Select.
   * Use the `SelectSize` enum for this value.
   */
  size?: SelectSize
}

export const Select: React.FC<SelectProps> = memo(({ message, size }) => {
  return (
    <>
      <div>Hello, Select!</div>
      {message && <div className={styles.message}>{message}</div>}
      <div>Size: {size}</div>
    </>
  )
})

Select.defaultProps = {
  message: 'No message specified',
  size: SelectSize.small,
}

/**
 * Hello, this is a Select-like component.
 */
export default React.memo(Select)
