import styled from 'styled-components'

const StyledSearch = styled.div`
  input {
    width: 100%;
    max-width: 40rem;
    padding: 8px;
    border: 0;
    font-size: 1.2rem;
    border: 1px solid ${(props) => props.theme.border_2};
    border-radius: 2px;

    &:focus {
      outline: 0;
      border-color: ${(props) => props.theme.highlight};
    }
  }
`

export default StyledSearch
