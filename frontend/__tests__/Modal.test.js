import {render, fireEvent} from '@testing-library/react'

import Modal from '#root/components/Modal'

test('renders null when isOpen prop is false', () => {
  const {container} = render(<Modal handleClose={() => {}} />)

  expect(container.firstChild).toBeNull()
})

test('renders with defaults when isOpen prop is true', () => {
  const {getByTestId} = render(<Modal isOpen={true} handleClose={() => {}} />)

  expect(getByTestId('modal')).toBeInTheDocument()
  expect(getByTestId('closeButton')).toBeInTheDocument()
})

test('calls handleClose on mouseDown when closeOnClick prop is true', () => {
  const mockedHandleClose = jest.fn()

  const {getByTestId} = render(
    <Modal isOpen={true} handleClose={mockedHandleClose} />,
  )

  fireEvent.mouseDown(getByTestId('modal'))
  fireEvent.mouseDown(getByTestId('body'))

  expect(mockedHandleClose).toHaveBeenCalledTimes(1)
})

test('does not call handleClose on mouseDown when closeOnClick prop is false', () => {
  const mockedHandleClose = jest.fn()

  const {getByTestId} = render(
    <Modal
      isOpen={true}
      closeOnClick={false}
      handleClose={mockedHandleClose}
    />,
  )

  fireEvent.mouseDown(getByTestId('modal'))

  expect(mockedHandleClose).not.toHaveBeenCalled()
})

test('calls handleClose on closeButton', () => {
  const mockedHandleClose = jest.fn()

  const {getByTestId} = render(
    <Modal isOpen={true} handleClose={mockedHandleClose} />,
  )

  fireEvent.click(getByTestId('closeButton'))

  expect(mockedHandleClose).toHaveBeenCalled()
})

test('does not render closeButton when closeButton prop is false', () => {
  const {queryByTestId} = render(
    <Modal isOpen={true} closeButton={false} handleClose={() => {}} />,
  )

  expect(queryByTestId('closeButton')).toBeNull()
})
