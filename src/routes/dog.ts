import { createRoute, z, } from '@hono/zod-openapi'

const ErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: 'Bad Request',
  }),
})

export const GetDogsParamsSchema = z.object({
  name: z.string().optional(),
  breed: z.string().optional(),
})

export const DogSchema = z.object({
  name: z.string(),
  breed: z.string(),
  birthDate: z.string(),
  createdAt: z.string(),
})


export const DogsSchema = z.array(DogSchema)

export type GetDogsParamsSchema = z.infer<typeof GetDogsParamsSchema>
export type DogSchema = z.infer<typeof DogSchema>
export type DogsSchema = z.infer<typeof DogsSchema>

export const getDogsRoute = createRoute({
  method: 'get',
  path: '/dogs',
  request: {
    params: GetDogsParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DogsSchema,
        },
      },
      description: 'get dogs',
    },
  },
  400: {
    content: {
      'application/json': {
        schema: ErrorSchema,
      },
    },
    description: 'Returns an error',
  },
})

export type getDogsHandlerInput = {
  params: GetDogsParamsSchema
}

export const getDogsHandler = async ({
  params,
}: getDogsHandlerInput): Promise<DogsSchema> => {
  console.log('params', params);

  return [{
    name: 'dog',
    breed: 'breed',
    birthDate: 'yyyy-MM-dd',
    createdAt: 'yyyy-MM-ddThh:mm:ss',
  }]
}