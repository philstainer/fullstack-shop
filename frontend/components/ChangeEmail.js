import {useForm} from 'react-hook-form'
import {useMutation} from '@apollo/react-hooks'

import StyledForm from '#root/components/styles/StyledForm'

import ME_QUERY from '#root/graphql/me.query'
import CHANGE_EMAIL_MUTATION from '#root/graphql/changeEmail.mutation'

const ChangeEmail = () => {
  const [changeEmail, {data, loading, error}] = useMutation(
    CHANGE_EMAIL_MUTATION,
    {
      refetchQueries: [{query: ME_QUERY}],
    },
  )

  const {register, handleSubmit, errors, watch, reset} = useForm()

  const onSubmit = async variables => {
    try {
      await changeEmail({variables})
      reset()
    } catch (err) {}
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <h2>Change Email</h2>

      <fieldset disabled={loading} aria-busy={loading}>
        <label>
          Current Password
          <input
            type="password"
            placeholder="Current Password"
            name="password"
            data-testid="password"
            ref={register({
              required: 'You must specify your password',
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
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
          Confirm Email
          <input
            type="email"
            placeholder="Confirm Email"
            name="confirmEmail"
            data-testid="confirmEmail"
            ref={register({
              required: 'You must confirm your email',
              validate: value =>
                value === watch('email') || 'Emails do not match',
            })}
          />
          {errors.confirmEmail && <p>{errors.confirmEmail.message}</p>}
        </label>

        {error && <p className="error">{error?.message}</p>}
        {data && <p className="success">{data?.changeEmail?.message}</p>}

        <button data-testid="submit" type="submit">
          Change Email
        </button>
      </fieldset>
    </StyledForm>
  )
}

export default ChangeEmail
