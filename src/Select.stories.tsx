import React from 'react'

import { storiesOf } from '@storybook/react'

import Select from './Select'

storiesOf('Select', module)
  .add('Basic Example', () => <Select />)
  .add('With Message', () => <Select message="This is a message!" />)
