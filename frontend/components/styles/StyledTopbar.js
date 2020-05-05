import styled from 'styled-components'

const StyledTopbar = styled.div`
  display: grid;
  justify-content: end;
  border-bottom: 1px solid ${(props) => props.theme.border};
  padding: 0 2rem;
  font-size: 1.2rem;

  ul {
    display: flex;
    list-style: none;
  }

  li {
    display: flex;
    padding: 2px 10px;
    border-bottom: 1.5px solid transparent;
    border-top: 1.5px solid transparent;
    transition: border-bottom 0.2s linear;

    &:hover {
      border-bottom: 1.5px solid ${(props) => props.theme.highlight};
    }
  }

  a {
    color: ${(props) => props.theme.grey};
    transition: color 0.2s linear;

    &:hover {
      color: inherit;
    }
  }
`

export default StyledTopbar
