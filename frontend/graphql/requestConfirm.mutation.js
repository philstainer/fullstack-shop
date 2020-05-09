import gql from 'graphql-tag'

const CONFIRM_ACCOUNT_MUTATION = gql`
  mutation {
    requestConfirm {
      status
      message
    }
  }
`

export default CONFIRM_ACCOUNT_MUTATION
