import React from 'react'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useMutation, useQuery} from '@apollo/react-hooks'

import StyledForm from '#root/components/styles/StyledForm'

import REQUEST_RESET_MUTATION from '#root/graphql/requestReset.mutation'

const RequestReset = () => {
  const [requestReset, {called, loading, error}] = useMutation(
    REQUEST_RESET_MUTATION,
  )

  const {register, handleSubmit, errors, watch} = useForm()

  const onSubmit = async variables => {
    await requestReset({variables})
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

        {error?.message && <p>{error.message}</p>}

        {!error && !loading && called && (
          <p className="success">Email has been sent to account.</p>
        )}

        <button type="submit">Request Reset!</button>
      </fieldset>
    </StyledForm>
  )
}

export default RequestReset
