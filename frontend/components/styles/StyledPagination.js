import styled from 'styled-components'

const StyledPagination = styled.ul`
  display: inline-grid;
  grid-template-columns: repeat(4, auto);
  align-items: stretch;
  justify-content: center;
  align-content: center;
  margin: 2.5rem 0;
  border: 1px solid ${props => props.theme.border_2};
  border-radius: 2px;

  & > * {
    margin: 0;
    padding: 1rem 2rem;

    &:not(:last-child) {
      border-right: 1px solid ${props => props.theme.border_2};
    }
  }

  a[aria-disabled='true'] {
    color: grey;
    pointer-events: none;
  }
`

export default StyledPagination
