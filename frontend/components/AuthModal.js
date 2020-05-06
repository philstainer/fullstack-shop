import React from 'react'
import {useQuery, useMutation} from '@apollo/react-hooks'

import Modal from '#root/components/Modal'
import Tabs from '#root/components/Tabs'

import SignIn from '#root/components/SignIn'
import SignUp from '#root/components/SignUp'

import {
  AUTH_MODAL_QUERY,
  AUTH_MODAL_MUTATION,
} from '#root/graphql/localResolvers'

const tabs = [
  {text: 'Sign In', component: <SignIn />},
  {text: 'Sign Up', component: <SignUp />},
]

const AuthModal = () => {
  const {data} = useQuery(AUTH_MODAL_QUERY)
  const [toggleAuthModal] = useMutation(AUTH_MODAL_MUTATION)

  return (
    <Modal
      isOpen={data.authModal !== null}
      handleClose={() => toggleAuthModal()}
    >
      <Tabs tabs={tabs} activeIndex={data.authModal} />
    </Modal>
  )
}

export default AuthModal
