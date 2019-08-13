import * as React from 'react'

import styles from './Select.module.scss'

export type SelectProps = {
  message?: string
}

export const Select: React.FC<SelectProps> = React.memo(({ message }) => {
  return (
    <>
      <div>Hello, Select!</div>
      {message && <div className={styles.message}>{message}</div>}
    </>
  )
})

export default Select
