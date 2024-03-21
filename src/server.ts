import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swagger_ui from '@fastify/swagger-ui'

import { routes } from './routes'

const app = fastify()

app.register(swagger)
app.register(swagger_ui, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
})
app.register(routes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('server is runnig')
  })
