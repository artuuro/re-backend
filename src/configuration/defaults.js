import routes from './routes';

export default {
  routes: routes,
  database: {
    config: {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    }
  },
  server: {
    development: true,
    port: 3000,
    logger: {
      prettyPrint: true
    },
    helmet: {
      hidePoweredBy: {
        setTo: `${process.env.npm_package_name}-${process.env.npm_package_version}`
      }
    },
    docs: {
      routePrefix: '/api',
      exposeRoute: true,
      addModels: true,
      hideUntagged: true,
      swagger: {
        openapi: '3.0.0',
        info: {
          title: 'API',
          description: `${process.env.npm_package_description} - <a href="docs.html">DOCUMENTATION</a>`,
          version: `${process.env.npm_package_name}-${process.env.npm_package_version}`
        },
        layout: 'StandaloneLayout',
        docExpansion: 'list',
        host: `127.0.0.1:3000`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              in: 'header'
            }
          }
        }
      }
    }
  }
}
