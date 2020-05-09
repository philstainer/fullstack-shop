import {useForm} from 'react-hook-form'
import {useMutation} from '@apollo/react-hooks'

import StyledForm from '#root/components/styles/StyledForm'

import CHANGE_PASSWORD_MUTATION from '#root/graphql/changePassword.mutation'

const ChangePassword = () => {
  const [changePassword, {data, loading, error}] = useMutation(
    CHANGE_PASSWORD_MUTATION,
  )

  const {register, handleSubmit, errors, watch, reset} = useForm()

  const onSubmit = async variables => {
    try {
      await changePassword({variables})
      reset()
    } catch (err) {}
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <h2>Change Password</h2>

      <fieldset disabled={loading} aria-busy={loading}>
        <label>
          Current Password
          <input
            type="password"
            placeholder="Current Password"
            name="currentPassword"
            data-testid="currentPassword"
            ref={register({
              required: 'You must specify your password',
            })}
          />
          {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
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

        {error && <p className="error">{error?.message}</p>}
        {data && <p className="success">{data?.changePassword?.message}</p>}

        <button data-testid="submit" type="submit">
          Change Password
        </button>
      </fieldset>
    </StyledForm>
  )
}

export default ChangePassword
