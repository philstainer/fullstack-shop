import '@babel/polyfill'

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

;(async () => {
  const users = await prisma.user.findMany()

  console.log(users)
})()
