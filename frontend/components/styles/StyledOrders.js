import styled from 'styled-components'

const StyledOrders = styled.div`
  grid-column: 1 / span 2;

  h2 {
    margin-bottom: 4rem;
  }

  li {
    box-shadow: ${props => props.theme.bs};
    list-style: none;
    transition: 0.2s transform ease-out;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    &:not(:first-child) {
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  a {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;

    padding: 2rem;
    border: 1px solid ${props => props.theme.border};

    p:nth-child(3),
    p:nth-child(4) {
      text-align: center;
    }

    p:nth-child(5) {
      text-align: end;
    }
  }
`

export default StyledOrders
