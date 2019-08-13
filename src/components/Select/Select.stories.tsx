import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Select, { SelectSize } from './Select'

storiesOf('Select', module)
  .addDecorator(withInfo)
  .addParameters({
    info: {
      inline: true,
    },
  })
  .add('Basic Example', () => <Select />)
  .add('With Message', () => (
    <Select message="This is a message!" size={SelectSize.large} />
  ))
