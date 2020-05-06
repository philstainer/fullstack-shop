import context from '#root/graphql/context'
import * as models from '#root/models'

const req = {userId: '123'}

test('returns property db with models', () => {
  expect(context()).toMatchObject({db: models})
})

test('returns passed objects', () => {
  expect(context({req})).toMatchObject({db: models, req})
})
