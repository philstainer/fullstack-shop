import graphqlFields from 'graphql-fields'

// Generate select string for better performance.
const selectedFields = (info, ignoredFields = []) => {
  const fields = graphqlFields(info)

  // Always select _id
  fields.id = {}
  fields._id = {}

  delete fields.__typename

  return Object.keys(fields)
    .filter(field => !ignoredFields.includes(field))
    .join(' ')
}

export default selectedFields
