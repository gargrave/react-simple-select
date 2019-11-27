import { name, random } from 'faker'

const makePerson = () => ({
  firstName: name.firstName(),
  id: random.uuid(),
  lastName: name.lastName(),
})

export const options = Array(10)
  .fill(0)
  .map(makePerson)

export const getOptionKey = option => `${option.id}`
export const getOptionLabel = option => `${option.firstName} ${option.lastName}`
