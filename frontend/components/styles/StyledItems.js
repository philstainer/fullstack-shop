import styled from 'styled-components'

const StyledItems = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2.5rem;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

export default StyledItems
