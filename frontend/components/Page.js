import React, {Component} from 'react'
import styled, {ThemeProvider, createGlobalStyle} from 'styled-components'
import Meta from './Meta'

const theme = {
  red: '#FF0000',
  black: '#393939',
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
  html {
    box-sizing: border-box;
    font-size: 62.5%;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
  }
`

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <GlobalStyle />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    )
  }
}

export default Page
