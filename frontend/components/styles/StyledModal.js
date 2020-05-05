import styled from 'styled-components'

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
`

StyledModal.Body = styled.div`
  position: fixed;
  background: white;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
  border-radius: 2px;
  min-width: 500px;
`

StyledModal.CloseButton = styled.span`
  position: fixed;
  top: 0;
  right: -30px;
  height: 24px;
  width: 24px;
  border-radius: 2px;
  cursor: pointer;

  transition: background 0.2s linear;

  :hover {
    background: rgba(0, 0, 0, 0.2);
  }

  :before,
  :after {
    position: absolute;
    left: 11px;
    top: 5px;
    content: ' ';
    height: 14px;
    width: 2px;
    background-color: white;
  }

  :before {
    transform: rotate(45deg);
  }

  :after {
    transform: rotate(-45deg);
  }
`

export default StyledModal
