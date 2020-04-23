'use strict'

import * as models from '#root/models'

const context = (req) => ({...req, db: models})

export default context
