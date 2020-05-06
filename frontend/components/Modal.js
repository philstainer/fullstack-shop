import React from 'react'
import PropTypes from 'prop-types'

import StyledModal from '#root/components/styles/StyledModal'

const Modal = ({isOpen, closeOnClick, handleClose, closeButton, children}) => {
  if (!isOpen) return null

  return (
    <StyledModal
      data-testid="modal"
      onMouseDown={closeOnClick ? handleClose : null}
    >
      <StyledModal.Body
        data-testid="body"
        onMouseDown={e => e.stopPropagation()}
      >
        <>
          {children}
          {closeButton && (
            <StyledModal.CloseButton
              data-testid="closeButton"
              onClick={handleClose}
            />
          )}
        </>
      </StyledModal.Body>
    </StyledModal>
  )
}

Modal.defaultProps = {
  isOpen: false,
  closeOnClick: true,
  closeButton: true,
  children: null,
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  closeOnClick: PropTypes.bool,
  closeButton: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default Modal
