import styled, {createGlobalStyle} from 'styled-components'

export const theme = {
  white: '#f1faee',
  red: '#e63946',
  highlight: '#228CDB',
  highlight_2: '#2ca58d',
  text: '#2B303A',
  border: '#efefef',
  border_2: '#dcdcda',
  grey: '#787878',
  maxWidth: '1000px',
  bs: '0 5px 25px 0 rgba(0,0,0,0.08)',
}

export const Page = styled.div`
  background: white;
  color: ${props => props.theme.black};
`

export const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Open Sans';
    src: url('open-sans-regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('open-sans-600.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
  }

  html {
    box-sizing: border-box;
    font-size: 62.5%;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'Open Sans', sans-serif;
    color: ${theme.text}
  }

  a {
    text-decoration: none;
    color: ${theme.text};
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    color: inherit;
  }
`
