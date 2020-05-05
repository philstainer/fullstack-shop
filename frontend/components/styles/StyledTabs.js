import styled from 'styled-components'

const StyledTabs = styled.div`
  ul {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-column-gap: 1.5rem;
    list-style: none;
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.border_2};
    margin-bottom: 1.5rem;
  }

  li {
    border-bottom: 1px solid transparent;
    cursor: pointer;
    font-weight: bold;

    color: ${(props) => props.theme.text};

    &.active {
      color: ${(props) => props.theme.highlight};
      border-bottom: 1px solid ${(props) => props.theme.highlight};
    }
  }

  & > div {
  }
`

export default StyledTabs
