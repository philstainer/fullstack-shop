import User from '#root/models/User'

const context = (req) => ({...req, db: {User}})

export default context
