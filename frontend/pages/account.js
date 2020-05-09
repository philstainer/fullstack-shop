import {useQuery, useMutation} from '@apollo/react-hooks'
import styled from 'styled-components'

import ME_QUERY from '#root/graphql/me.query'
import REQUEST_CONFIRM_MUTATION from '#root/graphql/requestConfirm.mutation'
import withAuth from '#root/components/withAuth'

import ChangePassword from '#root/components/ChangePassword'
import ChangeEmail from '#root/components/ChangeEmail'

export const Account = () => {
  const {data, loading, error} = useQuery(ME_QUERY)
  const [requestConfirm, {loading: requestLoading, called}] = useMutation(
    REQUEST_CONFIRM_MUTATION,
  )

  const confirmed = data?.me?.confirmed

  if (loading) return <div>Loading account information...</div>
  if (error) return <div>Failed to load account information...</div>

  return (
    <StyledAccount>
      <StyledAccount.Main>
        <h3>Welcome</h3>
        <h1>{data?.me?.name}</h1>
        <p>{data?.me?.email}</p>
        <button
          data-testid="button"
          className={confirmed ? 'success' : 'failure'}
          title={
            !confirmed
              ? 'Click to resend email confirmation'
              : 'Email has been confirmed'
          }
          disabled={requestLoading || confirmed || called}
          onClick={!confirmed ? requestConfirm : null}
        >
          {(!requestLoading && called && 'Email sent!') ||
            (confirmed ? 'Confirmed' : 'Not Confirmed')}
        </button>
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
  grid-gap: 4rem;
`
StyledAccount.Main = styled.div`
  grid-column: 1 / span 2;
  text-align: center;
  font-weight: bold;
  padding: 4rem 0;

  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }

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

  button {
    padding: 5px 10px;
    color: white;
    outline: none;
    border: none;
    border-radius: 2px;

    &:disabled {
      opacity: 0.5;
    }

    &.success {
      background: ${props => props.theme.highlight_2};
    }

    &.failure {
      background: ${props => props.theme.red};
      cursor: pointer;
    }
  }
`

StyledAccount.ConfirmedBadge = styled.span``
