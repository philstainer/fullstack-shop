import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import Topbar from '#root/components/Topbar'
import Search from '#root/components/Search'
import Actions from '#root/components/Actions'
import Cart from '#root/components/Cart'

const StyledMiddleBar = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content min-content;
  align-items: center;
  grid-column-gap: 1rem;
  padding: 0 2rem;
  border-bottom: 1px solid ${(props) => props.theme.light_grey};

  /* @media (max-width: 1300px) {
    grid-template-columns: 1fr;
    justify-content: center;
  } */
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
  /* @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  } */
`

const Header = () => {
  return (
    <div>
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
    </div>
  )
}

export default Header
