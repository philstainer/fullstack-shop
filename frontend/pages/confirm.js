import {useEffect} from 'react'
import PropTypes from 'prop-types'

import {useMutation} from '@apollo/react-hooks'
import Router from 'next/router'

import CONFIRM_ACCOUNT_MUTATION from '#root/graphql/confirmAccount.mutation'

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 133px)',
}

const Confirm = ({query: {confirmToken}}) => {
  const [confirmAccount, {error}] = useMutation(CONFIRM_ACCOUNT_MUTATION, {
    variables: {confirmToken},
  })

  const handleConfirm = async () => {
    try {
      await confirmAccount()

      Router.replace({pathname: '/'})

      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  useEffect(() => {
    handleConfirm()
  }, [])

  if (error) return <div style={styles}>{error.message}</div>

  return null
}

Confirm.propTypes = {
  query: PropTypes.shape({
    confirmToken: PropTypes.string.isRequired,
  }).isRequired,
}

export default Confirm
