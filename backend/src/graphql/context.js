'use strict'

import models from '#root/models'

const context = (req) => ({...req, db: models})

export default context
