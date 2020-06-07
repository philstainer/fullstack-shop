import styled from 'styled-components'

const StyledCart = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  &:hover {
    span {
      transform: scale(0.95);
    }
  }

  svg {
    height: 2.5rem;
    width: 2.5rem;
    margin-right: 17px;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 13px;
    left: 13px;
    background: ${props => props.theme.red};
    color: white;
    border-radius: 50%;
    padding: 0.5rem;
    min-width: 2rem;
    min-height: 2rem;
    line-height: 0;
    font-size: 1rem;

    transition: 0.1s transform linear;
  }
`

export default StyledCart
