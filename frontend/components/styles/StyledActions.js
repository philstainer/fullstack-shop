import styled from 'styled-components'

const StyledActions = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1rem;
  text-transform: uppercase;

  a {
    padding: 2rem 1rem;
    cursor: pointer;
    color: ${props => props.theme.grey};
    transition: color 0.2s linear;

    &:hover {
      color: inherit;
    }
  }
`

export default StyledActions
