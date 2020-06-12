import styled from 'styled-components'

const StyledRemoveCartItem = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  padding: 0 15px;

  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

export default StyledRemoveCartItem
