import { name, random } from 'faker'

const makePerson = () => ({
  firstName: name.firstName(),
  id: random.uuid(),
  lastName: name.lastName(),
})

export const options = Array(10)
  .fill(0)
  .map(makePerson)

export const searchableOptions = Array(100)
  .fill(0)
  .map(makePerson)

export const getUserFullName = option =>
  `${option.firstName} ${option.lastName}`
export const getOptionKey = option => `${option.id}`
export const getOptionLabel = option => getUserFullName(option)
