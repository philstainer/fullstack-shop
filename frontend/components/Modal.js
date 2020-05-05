import React from 'react'
import PropTypes from 'prop-types'

import StyledModal from '#root/components/styles/StyledModal'

const Modal = (props) => {
  if (!props.isOpen) return null

  return (
    <StyledModal
      data-testid="modal"
      onMouseDown={props.closeOnClick ? props.handleClose : null}
    >
      <StyledModal.Body
        data-testid="body"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <React.Fragment>
          {props.children}
          {props.closeButton && (
            <StyledModal.CloseButton
              data-testid="closeButton"
              onClick={props.handleClose}
            />
          )}
        </React.Fragment>
      </StyledModal.Body>
    </StyledModal>
  )
}

Modal.defaultProps = {
  isOpen: false,
  closeOnClick: true,
  closeButton: true,
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  closeOnClick: PropTypes.bool,
  closeButton: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
}

export default Modal
