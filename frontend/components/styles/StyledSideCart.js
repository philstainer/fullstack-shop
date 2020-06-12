import styled from 'styled-components'

const StyledSideCart = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  position: relative;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 5;

  height: 100%;
  background: white;
  width: 40%;
  min-width: 500px;
  bottom: 0;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);

  transition: all 0.3s;

  user-select: none;

  transform: translateX(100%);
  ${props => props.open && `transform: translateX(0);`};

  header {
    border-bottom: 1px solid ${props => props.theme.border_2};
    margin-bottom: 2rem;
    padding: 2rem;

    h2 {
      font-size: 3rem;
    }

    p {
    }

    .close {
      position: absolute;
      z-index: 2;
      right: 2rem;
      cursor: pointer;
      padding: 10px;
      transition: transform 0.1s linear;

      &:hover {
        transform: scale(0.9);
      }
    }
  }

  ul {
    padding: 2rem;
    list-style: none;
    overflow-y: auto;
  }

  footer {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;

    border-top: 1px solid ${props => props.theme.border_2};
    font-size: 3rem;
    font-weight: 600;
    padding: 2rem;

    button {
      height: 100%;

      background: ${props => props.theme.highlight};
      color: white;
      font-weight: 300;
      border: 0;
      border-radius: 2px;
      font-size: 2rem;
      padding: 0.8rem 1.5rem;

      transition: opacity 0.5s linear;

      &[disabled] {
        opacity: 0.5;
      }
    }
  }
`

export default StyledSideCart
