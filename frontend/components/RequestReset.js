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
    try {
      await requestReset({variables})
    } catch (error) {}
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

        {error?.message && <p className="error">{error.message}</p>}

        {!error && !loading && called && (
          <p className="success">Success! Check your email for a reset link!</p>
        )}

        <button type="submit">Request Reset!</button>
      </fieldset>
    </StyledForm>
  )
}

export default RequestReset
