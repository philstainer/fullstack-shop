import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const StyledTopbar = styled.div`
  display: grid;
  justify-content: end;
  border-bottom: 1px solid ${(props) => props.theme.light_grey};
  padding: 0 20px;
  font-size: 1.2rem;

  ul {
    display: flex;
    list-style: none;
  }

  li {
    display: flex;
    padding: 2px 10px;
    border-bottom: 1.5px solid transparent;
    border-top: 1.5px solid transparent;
    transition: border-bottom 0.2s linear;

    &:hover {
      border-bottom: 1.5px solid ${(props) => props.theme.black};
    }
  }

  a {
    color: ${(props) => props.theme.grey};
    transition: color 0.2s linear;

    &:hover {
      color: inherit;
    }
  }
`

const Topbar = () => {
  return (
    <StyledTopbar>
      <ul>
        <li>
          <Link href="/support">
            <a>Support</a>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </li>
        <li>
          <Link href="/signin">
            <a>Sign in</a>
          </Link>
        </li>
      </ul>
    </StyledTopbar>
  )
}

export default Topbar
