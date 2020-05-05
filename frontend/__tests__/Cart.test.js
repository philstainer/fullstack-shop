import {render} from '@testing-library/react'

import Cart from '../components/Cart'

test('renders', () => {
  const {asFragment} = render(<Cart />)

  expect(asFragment()).toMatchSnapshot()
})
