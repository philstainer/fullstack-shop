import {render} from '@testing-library/react'

import Topbar from '#root/components/Topbar'

test('renders', () => {
  const {getByText} = render(<Topbar />)

  const supportLink = getByText(/support/i)
  const contactLink = getByText(/contact/i)

  expect(supportLink).toBeInTheDocument()
  expect(contactLink).toBeInTheDocument()
})
