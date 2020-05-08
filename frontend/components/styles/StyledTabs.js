import styled from 'styled-components'

const StyledTabs = styled.div`
  ul {
    display: flex;
    list-style: none;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.border_2};
    margin-bottom: 1.5rem;
  }

  li {
    border-bottom: 1px solid transparent;
    cursor: pointer;
    font-weight: bold;

    color: ${props => props.theme.text};

    &.active {
      color: ${props => props.theme.highlight};
      border-bottom: 1px solid ${props => props.theme.highlight};
    }

    &:not(:last-child) {
      margin-right: 1.5rem;
    }
  }

  & > div {
  }
`

export default StyledTabs
