import accessEnv from '#root/utils/accessEnv'

module.exports = require('stripe')(accessEnv('STRIPE_SECRET'))
