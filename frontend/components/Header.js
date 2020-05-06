import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import Topbar from '#root/components/Topbar'
import Search from '#root/components/Search'
import Actions from '#root/components/Actions'
import Cart from '#root/components/Cart'

const StyledMiddleBar = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr auto min-content;
  align-items: center;
  grid-column-gap: 1rem;
  padding: 0 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
`

const Logo = styled.h1`
  font-size: 3rem;
  position: relative;
  z-index: 2;
  a {
    padding: 0.5rem 1rem;
    text-transform: uppercase;
    text-decoration: none;
  }
`

const Header = () => {
  return (
    <>
      <Topbar />

      <StyledMiddleBar>
        <Logo>
          <Link href="/">
            <a>Shop</a>
          </Link>
        </Logo>

        <Search />

        <Actions />

        <Cart />
      </StyledMiddleBar>
    </>
  )
}

export default Header
