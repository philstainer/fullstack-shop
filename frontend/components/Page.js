import React, {Component} from 'react'
import styled, {ThemeProvider, createGlobalStyle} from 'styled-components'
import Meta from '#root/components/Meta'
import Header from '#root/components/Header'

const theme = {
  red: '#FF0000',
  black: '#393939',
  light_grey: '#efefef',
  grey: '#787878',
  maxWidth: '1000px',
}

const StyledPage = styled.div`
  background: white;
  color: ${(props) => props.theme.black};
`

const Inner = styled.div`
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

const GlobalStyle = createGlobalStyle`
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
  }

  a {
    text-decoration: none;
    color: ${theme.black};
  }
`

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <GlobalStyle />
          <Header />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    )
  }
}

export default Page
