import {render} from '@testing-library/react'

import Index from '../pages/index'

test('renders learn react link', () => {
  const {getByText, debug} = render(<Index />)

  const title = getByText(/page/i)

  expect(title).toMatchSnapshot()
})
