import nanoid from 'nanoid'

import { css as cssHelper } from '../Select.helpers'

const cssMap = (className: string): string => `.${cssHelper(className)}`

export const css = (classNames: string | string[]): string =>
  (Array.isArray(classNames)
    ? classNames.map(cssMap)
    : [classNames].map(cssMap)
  ).join('')

export type User = {
  firstName: string
  id: string
  lastName: string
}

export const usersOptions: User[] = [
  { firstName: 'Larry', id: nanoid(), lastName: 'McDonald' },
  { firstName: 'Lacey', id: nanoid(), lastName: 'Struthers' },
  { firstName: 'Sandra', id: nanoid(), lastName: 'Callahan' },
  { firstName: 'Billy', id: nanoid(), lastName: 'Pickles' },
  { firstName: 'Davie', id: nanoid(), lastName: 'McBavie' },
]

export const searchResultUserOptions: User[] = [
  { firstName: 'Search', id: nanoid(), lastName: 'Result 1' },
  { firstName: 'Search', id: nanoid(), lastName: 'Result 2' },
  { firstName: 'Search', id: nanoid(), lastName: 'Result 3' },
]

export const getUserIdString = (user: User) => `${user?.id}`
export const getUserFullName = (user: User) =>
  `${user.firstName} ${user.lastName}`
