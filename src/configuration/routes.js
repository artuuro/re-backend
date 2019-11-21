export default [{
  path: '/',
  method: 'GET',
  handler: 'ping',
  middlewares: ['Auth'],
  schema: {
    summary: 'Ping endpoint',
    tags: ['Static'],
    response: {
      200: {
        description: 'Returns a pong response with some server info',
        type: 'object',
        properties: {
          message: { type: 'string' },
          time: { type: 'string' }
        }
      },
      403: {
        description: 'User is not authenticated',
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  }
}, {
  path: '/api/auth',
  method: 'POST',
  handler: 'authentication',
  schema: {
    summary: 'Sign-in endpoint',
    tags: ['Static'],
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    },
    response: {
      200: {
        description: 'Authentication valid',
        type: 'object',
        properties: {
          token: { type: 'string' }
        }
      },
      404: {
        description: 'Authentication invalid',
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  }
}];
