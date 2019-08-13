import * as React from 'react'

export type SelectProps = {
  message?: string
}

export const Select: React.FC<SelectProps> = React.memo(({ message }) => {
  return (
    <>
      <div>Hello, Select!</div>
      {message && <div>{message}</div>}
    </>
  )
})

export default Select
