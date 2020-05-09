import {useQuery} from '@apollo/react-hooks'
import styled from 'styled-components'

import ME_QUERY from '#root/graphql/me.query'
import withAuth from '#root/components/withAuth'

import ChangePassword from '#root/components/ChangePassword'
import ChangeEmail from '#root/components/ChangeEmail'

export const Account = () => {
  const {data, loading, error} = useQuery(ME_QUERY)

  if (loading) return <div>Loading account information...</div>
  if (error) return <div>Failed to load account information...</div>

  return (
    <StyledAccount>
      <StyledAccount.Main span={2} textCenter>
        <h3>Welcome</h3>
        <h1>{data?.me?.name}</h1>
        <p>{data?.me?.email}</p>
      </StyledAccount.Main>

      <ChangePassword />
      <ChangeEmail />
    </StyledAccount>
  )
}

export default withAuth(Account)

const StyledAccount = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
`
StyledAccount.Main = styled.div`
  grid-column: 1 / span 2;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2rem;

  h1 {
    line-height: 1;
    font-size: 4rem;
    color: ${props => props.theme.highlight};
  }

  h3 {
    text-transform: uppercase;
  }

  p {
    font-size: 1.2rem;
    font-weight: normal;
  }
`
