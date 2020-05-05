import React from 'react'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useMutation, useQuery} from '@apollo/react-hooks'

import StyledForm from '#root/components/styles/StyledForm'

import SIGN_IN_MUTATION from '#root/graphql/signIn.mutation'
import ME_QUERY from '#root/graphql/me.query'
import {AUTH_MODAL_MUTATION} from '#root/graphql/localResolvers'

const SignIn = () => {
  const [signIn, {loading, error}] = useMutation(SIGN_IN_MUTATION, {
    refetchQueries: [{query: ME_QUERY}],
    awaitRefetchQueries: true,
  })

  const [toggleAuthModal] = useMutation(AUTH_MODAL_MUTATION)

  const {register, handleSubmit, errors, watch} = useForm()

  const onSubmit = async (variables) => {
    await signIn({variables})

    toggleAuthModal()
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={loading} aria-busy={loading}>
        <label>
          Email
          <input
            data-testid="email"
            type="email"
            placeholder="Email"
            name="email"
            ref={register({required: 'You must specify a valid email'})}
            autoFocus
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>

        <label>
          Password
          <input
            data-testid="password"
            type="password"
            placeholder="Password"
            name="password"
            ref={register({
              required: 'You must specify a password',
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>

        {error?.message && <p>{error.message}</p>}

        <button type="submit">Sign In!</button>
      </fieldset>
    </StyledForm>
  )
}

export default SignIn
