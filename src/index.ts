import fs from 'fs'
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import YAML from 'js-yaml'
import { getDogsHandler, getDogsRoute } from './routes/dog'


const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi('User')


const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Retrieve the user',
    },
  },
})


const app = new OpenAPIHono()

app.openapi(route, (c) => {
  const { id } = c.req.valid('param')
  return c.jsonT({
    id,
    age: 42,
    name: 'Ultra-man',
  })
})

app.openapi(getDogsRoute, async (c) => {
  const params = c.req.valid('param')
  const result = await getDogsHandler({ params })
  return c.jsonT(result)
})

const OPENAPI_CONFIG = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
}

// The OpenAPI documentation will be available at /doc
app.doc('/doc', OPENAPI_CONFIG)

const registry = app.openAPIRegistry

const generator = new OpenApiGeneratorV3(registry.definitions)
const openApiObj = JSON.parse(JSON.stringify(generator.generateDocument(OPENAPI_CONFIG)))


const openApiYaml = YAML.dump(openApiObj)

fs.writeFile('./openapi.yaml', openApiYaml, 'utf8',
  (err) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log('openapi.yaml file created')
    }
  })

export default app