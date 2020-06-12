import styled from 'styled-components'

const StyledCartItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.border_2};

  img {
    margin-right: 10px;
    width: 100px;
    max-height: 100px;
    object-fit: cover;
  }
`

export default StyledCartItem
