import {render} from '@testing-library/react'

import Search from '../components/Search'

test('renders', () => {
  const {asFragment} = render(<Search />)

  expect(asFragment()).toMatchSnapshot()
})
