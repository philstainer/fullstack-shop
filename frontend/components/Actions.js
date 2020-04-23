import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const StyledActions = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1rem;
  text-transform: uppercase;

  li {
    display: flex;
    padding: 1rem;
  }

  a {
    color: ${(props) => props.theme.grey};
    transition: color 0.2s linear;

    &:hover {
      color: inherit;
    }
  }
`

const Actions = () => {
  return (
    <StyledActions>
      <li>
        <Link href="/sell">
          <a>Sell</a>
        </Link>
      </li>

      <li>
        <Link href="/account">
          <a>Account</a>
        </Link>
      </li>
    </StyledActions>
  )
}

export default Actions
