import {render, fireEvent} from '@testing-library/react'

import Tabs from '#root/components/Tabs'

const tabs = [
  {text: 'Sign In', component: <div>Sign In Component</div>},
  {text: 'Sign Up', component: <div>Sign Up Component</div>},
]

test('renders tabs headers and default tab', () => {
  const {getByText} = render(<Tabs tabs={tabs} />)

  expect(getByText(tabs[0].text)).toBeInTheDocument()
  expect(getByText(tabs[1].text)).toBeInTheDocument()

  expect(getByText(/sign in component/i)).toBeInTheDocument()
})

test('renders current tab via activeIndex prop', () => {
  const {getByText} = render(<Tabs tabs={tabs} activeIndex={1} />)

  expect(getByText(/sign up component/i)).toBeInTheDocument()
})

test('renders second tab when clicked', async () => {
  const {queryByText, findByText} = render(<Tabs tabs={tabs} />)

  expect(queryByText(/sign up component/i)).toBeNull()

  fireEvent.click(queryByText(tabs[1].text))

  const secondComponent = await findByText(/sign up component/i)

  expect(secondComponent).toBeInTheDocument()
})
