import React from 'react'
import { render } from '@testing-library/react'
import Version from '../Version'

it('renders correctly', () => {
  const { asFragment } = render(<Version />)
  expect(asFragment).toMatchSnapshot()
})
