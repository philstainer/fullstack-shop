import React from 'react'
import styled from 'styled-components'

const StyledSearch = styled.div`
  input {
    width: 100%;
    max-width: 40rem;
    padding: 8px;
    border: 0;
    font-size: 1.2rem;
    border: 1px solid ${(props) => props.theme.light_grey};
    border-radius: 2px;
  }
`

const Search = () => {
  return (
    <StyledSearch>
      <input type="text" placeholder="Search" />
    </StyledSearch>
  )
}

export default Search
