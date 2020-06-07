/* eslint-disable */

import {Component} from 'react'
import {ThemeProvider} from 'styled-components'

import Meta from '#root/components/Meta'
import Header from '#root/components/Header'
import AuthModal from '#root/components/AuthModal'
import SideCart from '#root/components/SideCart'
import * as StyledPage from '#root/components/styles/StyledPage'

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={StyledPage.theme}>
        <StyledPage.Page>
          <Meta />
          <StyledPage.GlobalStyle />
          <Header />
          <AuthModal />
          <SideCart />

          <StyledPage.Inner>{this.props.children}</StyledPage.Inner>
        </StyledPage.Page>
      </ThemeProvider>
    )
  }
}

export default Page
