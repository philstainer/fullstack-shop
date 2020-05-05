import React from 'react'
import Link from 'next/link'

import StyledTopbar from '#root/components/styles/StyledTopbar'

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
      </ul>
    </StyledTopbar>
  )
}

export default Topbar
