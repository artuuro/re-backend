import Fastify from 'fastify';
import formBodyParser from 'fastify-formbody';
import jsonWebToken from 'fastify-jwt';
import nodemailer from 'fastify-nodemailer';
import responseTime from 'fastify-response-time';
import helmet from 'fastify-helmet';
import swagger from 'fastify-oas';
import sensible from 'fastify-sensible';

class FastifyServer extends Fastify {
  constructor(settings) {
    super(settings);

    this.decorate('settings', settings);

    this.register(helmet, settings.helmet);
    this.register(formBodyParser);
    this.register(nodemailer, settings.mailer);
    this.register(sensible);
    this.register(jsonWebToken, settings.token);

    if (settings.development) {
      this.register(responseTime);
      this.register(swagger, settings.docs);
    }

    this.ready(err => {
      if (err) throw err;

      if (settings.development) {
        this.oas();
        this.log.info(`Documentation: http://${settings.host}:${settings.port}${settings.docs.routePrefix}`);
      }

      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.once(signal, async () => {
          this.log.info(`Shutdown because of ${signal} signal`);

          this.log.info('Closing MongoDB connection');
          await this.mongo.connection.close();
          
          return process.exit(0);
        });
      }
    });
  }
}

export default FastifyServer;
