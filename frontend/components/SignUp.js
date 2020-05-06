import React from 'react'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useMutation, useQuery} from '@apollo/react-hooks'

import StyledForm from '#root/components/styles/StyledForm'

import SIGN_UP_MUTATION from '#root/graphql/signUp.mutation'
import ME_QUERY from '#root/graphql/me.query'
import {AUTH_MODAL_MUTATION} from '#root/graphql/localResolvers'

const SignUp = () => {
  const [signUp, {loading, error}] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [{query: ME_QUERY}],
    awaitRefetchQueries: true,
  })

  const [toggleAuthModal] = useMutation(AUTH_MODAL_MUTATION)

  const {register, handleSubmit, errors, watch} = useForm()

  const onSubmit = async variables => {
    await signUp({variables})

    toggleAuthModal()
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={loading} aria-busy={loading}>
        <label>
          Name
          <input
            type="text"
            placeholder="Name"
            name="name"
            data-testid="name"
            ref={register({
              required: 'You must specify your name',
              maxLength: {
                value: 30,
                message: 'Name must have 30 characters max',
              },
              minLength: {
                value: 3,
                message: 'Name must have 3 characters min',
              },
            })}
            autoFocus
          />
          {errors.name && <p>{errors.name.message}</p>}
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="Email"
            name="email"
            data-testid="email"
            ref={register({required: 'You must specify a valid email'})}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Password"
            name="password"
            data-testid="password"
            ref={register({
              required: 'You must specify a password',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[//,.?;<>:!@#$%^&*(-=_+)|{}\[\]])[A-Za-z\d//,.?;<>:!@#$%^&*(-=_+)|{}\[\]]{8,30}$/,
                message:
                  'Password must contain one UPPER/lowercase, number, special character and between 8-30 length',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            data-testid="confirmPassword"
            ref={register({
              required: 'You must confirm your password',
              validate: value =>
                value === watch('password') || 'The passwords do not match',
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </label>

        {error?.message && <p>{error.message}</p>}

        <button data-testid="submit" type="submit">
          Sign Up!
        </button>
      </fieldset>
    </StyledForm>
  )
}

export default SignUp
