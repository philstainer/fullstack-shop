import * as models from '#root/models'
import loader from '#root/graphql/loaders'

const context = req => ({...req, db: models, loader})

export default context
