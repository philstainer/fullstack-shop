import {useMutation} from '@apollo/react-hooks'
import Router from 'next/router'
import PropTypes from 'prop-types'
import {useForm, watch} from 'react-hook-form'

import StyledForm from '#root/components/styles/StyledForm'

import RESET_PASSWORD_MUTATION from '#root/graphql/resetPassword.mutation'
import ME_QUERY from '#root/graphql/me.query'

const styles = {
  maxWidth: '600px',
  margin: '0 auto',
}

const Reset = ({query: {resetToken}}) => {
  const [resetPassword, {loading, error}] = useMutation(
    RESET_PASSWORD_MUTATION,
    {refetchQueries: [{query: ME_QUERY}]},
  )

  const {register, handleSubmit, errors, watch} = useForm()

  const onSubmit = async data => {
    try {
      await resetPassword({variables: {...data, resetToken}})

      Router.replace({pathname: '/'})

      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  return (
    <div style={styles}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={loading} aria-busy={loading}>
          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              name="password"
              data-testid="password"
              autoFocus
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

          {error?.message && <p className="error">{error.message}</p>}

          <button data-testid="submit" type="submit">
            Reset Password!
          </button>
        </fieldset>
      </StyledForm>
    </div>
  )
}

Reset.propTypes = {
  query: PropTypes.shape({
    resetToken: PropTypes.string.isRequired,
  }).isRequired,
}

export default Reset
