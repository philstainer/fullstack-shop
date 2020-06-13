import styled from 'styled-components'

const StyledOrder = styled.div`
  margin: 0 auto;
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.bs};
  padding: 2rem;

  & > p {
    display: grid;
    grid-template-columns: 1fr 5fr;
    border-bottom: 1px solid ${props => props.theme.border};

    span {
      padding: 1rem;

      &:first-child {
        font-weight: 900;
        text-align: right;
      }
    }
  }

  .order-item {
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: center;
    grid-gap: 2rem;
    padding: 2rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.border};
    }
  }
`

export default StyledOrder
