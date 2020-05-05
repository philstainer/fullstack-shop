import styled from 'styled-components'

const StyledActions = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1rem;
  text-transform: uppercase;

  li {
    /* display: flex; */
    padding: 1rem;
    cursor: pointer;

    &:hover {
      a {
        color: inherit;
      }
    }
  }

  a {
    color: ${(props) => props.theme.grey};
    transition: color 0.2s linear;
  }
`

export default StyledActions
