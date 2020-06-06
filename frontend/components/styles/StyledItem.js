import styled from 'styled-components'

const StyledItem = styled.div`
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.bs};
  position: relative;

  img {
    height: auto;
    height: 210px;
    width: 100%;
    object-fit: cover;
  }

  h3 {
    font-size: 1.4rem;
    color: ${props => props.theme.highlight};
    margin-top: 2.5rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 2;
    font-weight: 300;
    color: ${props => props.theme.grey};
  }

  .price {
    font-weight: bold;
    font-size: 1.6rem;
    color: ${props => props.theme.text};
  }

  .actions {
    margin-top: 5px;
    display: grid;
    width: 100%;
    border-top: 1px solid ${props => props.theme.border_2};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 5px;
    padding: 1rem 0;

    & > * {
      text-align: center;
      background: white;
      border: 0;
      font-size: 1rem;
      padding: 1rem;
      cursor: pointer;
      transition: 0.2s opacity;

      &:hover {
        opacity: 0.9;
      }
    }

    .add {
      color: ${props => props.theme.white};
      background: ${props => props.theme.highlight};
    }

    .remove {
      color: ${props => props.theme.white};
      background: ${props => props.theme.red};
    }
  }
`

export default StyledItem
